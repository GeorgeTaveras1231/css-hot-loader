'use strict';

test('basic reload', () => {
  document.body.innerHTML = `
  <head>
    <link href="a.css">
    <link href="b.css">
    <script src="a.js"></script>
  </head>
  `;
  const reload = require('../hotModuleReplacement')(1, {
    fileMap: '{fileName}',
  });
  const spy = jest.spyOn(EventTarget.prototype, 'addEventListener');
  let cb;
  spy.mockImplementation((event, _cb) => {
    cb = _cb;
  });
  reload();
  expect(spy).toHaveBeenCalled();

  expect(document.querySelectorAll('link').length === 3);
  cb();

  expect(document.querySelectorAll('link').length === 2);
  expect(document.querySelector('link').href.indexOf('?') > -1);

  spy.mockReset();
  spy.mockRestore();
});

test('reload mult style', () => {
  document.body.innerHTML = `
  <head>
    <link href="a.css">
    <link href="b.css">
    <link rel=icon type=image/png href=/img/favicon/favicon_32.png sizes=32x32>
    <script src="c.js"></script>
  </head>
  `;
  const reload = require('../hotModuleReplacement')(2, { fileMap: 'output/{fileName}', });
  const spy = jest.spyOn(EventTarget.prototype, 'addEventListener');
  let cb;
  spy.mockImplementation((event, _cb) => {
    cb = _cb;
  });
  reload();
  expect(spy).toHaveBeenCalled();

  expect(document.querySelectorAll('link').length === 4);
  cb();

  expect(document.querySelectorAll('link').length === 3);
  expect(document.querySelectorAll('link')[0].href.indexOf('?') > -1);
  expect(document.querySelectorAll('link')[1].href.indexOf('?') > -1);
  expect(document.querySelectorAll('link')[2].href.indexOf('?') === -1);

  spy.mockReset();
  spy.mockRestore();

});

