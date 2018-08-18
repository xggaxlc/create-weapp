import flatten from 'lodash-es/flatten';
import './index.scss';

Page({
  onLoad() {
    console.log(flatten([1, 1, 6]));
  }
});
