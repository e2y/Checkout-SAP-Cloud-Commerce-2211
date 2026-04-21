/* eslint-disable no-console, dot-notation, @typescript-eslint/typedef, @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-function-return-type */
import { APP_BASE_HREF } from '@angular/common';
import { defaultExpressErrorHandlers, ngExpressEngine as engine, NgExpressEngineDecorator, } from '@spartacus/setup/ssr';
import express, { Express } from 'express';
import { existsSync, readFileSync } from 'node:fs';
import * as https from 'node:https';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { environment } from './environments/environment';
import AppServerModule from './main.server';

const ngExpressEngine = NgExpressEngineDecorator.get(engine, {
  ssrFeatureToggles: {
    avoidCachingErrors: true,
  },
});

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server: Express = express();
  const serverDistFolder: string = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder: string = resolve(serverDistFolder, '../browser');
  const indexHtml: string = existsSync(join(serverDistFolder, 'index.server.original.html'))
    ? join(serverDistFolder, 'index.server.original.html')
    : join(serverDistFolder, 'index.server.html');
  const indexHtmlContent: string = readFileSync(indexHtml, 'utf-8');

  server.set('trust proxy', 'loopback');
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  server.use(defaultExpressErrorHandlers(indexHtmlContent));

  return server;
}

function run(): void {
  if (environment.production) {
    const port = process.env['PORT'] || 4000;

    // Start up the Node server
    const server = app();
    server.listen(port, () => {
      console.log(`Node Express server listening on http://localhost:${port}`);
    });
  } else {
    const port: string | 4200 = process.env['PORT'] || 4200;
    const credentials: {
      key: Buffer<ArrayBuffer>
      cert: Buffer<ArrayBuffer>
    } = {
      key: readFileSync(join(process.cwd(), 'ssl/key.pem')),
      cert: readFileSync(join(process.cwd(), 'ssl/cert.pem')),
    };

    // Start up the Node server
    const server = https.createServer(credentials, app());
    server.listen(port, () => {
      console.log(`Node Express server listening on https://localhost:${port}`);
    });
  }

}

run();
