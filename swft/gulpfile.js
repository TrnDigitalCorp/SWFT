// 'use strict';

// var _ = require('lodash');
// var path = require('path');
var gulp = require('gulp');
var del = require('del');

gulp.task('clean', function cleanBuild() {
    return del(['./server/build']);
});


