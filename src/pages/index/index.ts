import flatten from 'lodash-es/flatten';

Page({
  onLoad() {
    console.log(flatten([1, 1, 6]));
  }
});
