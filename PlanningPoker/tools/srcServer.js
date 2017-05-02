import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import proxy from 'http-proxy-middleware';

/* eslint-disable no-console */

const wsProxy = proxy('**/*.ashx', {
                target: 'ws://localhost:49073',
                changeOrigin: true,                     // for vhosted sites, changes host header to match to target's host
                ws: true,                               // enable websocket proxy
                logLevel: 'debug'
            });

const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(wsProxy);

app.get('*', function(req, res) {
  res.sendFile(path.join( __dirname, '../src/index.html'));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
});