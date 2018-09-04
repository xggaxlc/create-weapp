// for core-js polyfill
const g = Function('return this')();
g.parseInt = parseInt;
g.parseFloat = parseFloat;
g.Promise = Promise;
g.Array = Array;
g.Math = Math;
g.Number = Number;
g.Object = Object;
g.Function = Function;
g.String = String;
g.RegExp = RegExp;
g.Symbol = Symbol;

require('core-js/modules/es7.promise.finally');
require('core-js/modules/es7.symbol.async-iterator');

App({});
