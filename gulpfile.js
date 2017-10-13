var gulp = require('gulp');
var less = require('gulp-less');
var uglify = require('gulp-uglify'); // 压缩js文件
var notify = require('gulp-notify'); // 处理报错
var plumber = require('gulp-plumber'); // 处理异常
var rename = require('gulp-rename'); // 改名
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps-xj');
// jshint = require('gulp-jshint'),    //验证
// minifycss = require('gulp-minify-css'),     //压缩css
// imagemin = require('gulp-imagemin'),//图片压缩
var concat = require('gulp-concat');    // 合并文件
// htmlmin = require('gulp-htmlmin');    //压缩html

var dataApiSrcFiles = require('./scripts/dataApi/srcFiles.js');
var mapRenderSrcFiles = require('./scripts/mapRender/srcFiles.js');
var uikitsSrcFiles = require('./scripts/uikits/srcFiles.js');

dataApiSrcFiles = dataApiSrcFiles.map(function (path) {
    return 'scripts/dataApi/' + path;
});

mapRenderSrcFiles = mapRenderSrcFiles.map(function (path) {
    return 'scripts/mapRender/' + path;
});

uikitsSrcFiles = uikitsSrcFiles.map(function (path) {
    return 'scripts/uikits/' + path;
});

var dist = 'dist';

// 处理less文件
gulp.task('less-webEditor', function () {
    gulp.src(['less/webEditor/*.less'])
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(less())
        .pipe(gulp.dest('styles/webEditor'));
});
gulp.task('less-webEditor-poi', function () {
    gulp.src(['less/webEditor/editor-poi.less'])
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(less())
        .pipe(gulp.dest('styles/webEditor'));
});
gulp.task('less-webEditor-road', function () {
    gulp.src(['less/webEditor/editor-road.less'])
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(less())
        .pipe(gulp.dest('styles/webEditor'));
});
gulp.task('less-webEditor-column', function () {
    gulp.src(['less/webEditor/editor-column.less'])
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(less())
        .pipe(gulp.dest('styles/webEditor'));
});
gulp.task('less-agentEditor-agent', function () {
    gulp.src(['less/agentEditor/editor-agent.less'])
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(less())
        .pipe(gulp.dest('styles/agentEditor'));
});

/* 监听less */
gulp.task('watchLess', function () {
    // gulp.watch('less/*.less',['appLess']);
    gulp.watch('less/webEditor/*.less', ['less-webEditor']);
});

/* 监听less */
gulp.task('watchLess-poi', function () {
    // gulp.watch('less/*.less',['appLess']);
    gulp.watch('less/webEditor/editor-poi.less', ['less-webEditor-poi']);
});

/* 监听less */
gulp.task('watchLess-road', function () {
    // gulp.watch('less/*.less',['appLess']);
    gulp.watch('less/webEditor/editor-road.less', ['less-webEditor-road']);
});

/* 监听less */
gulp.task('watchLess-column', function () {
    // gulp.watch('less/*.less',['appLess']);
    gulp.watch('less/webEditor/editor-column.less', ['less-webEditor-column']);
});
/* 监听agent.less */
gulp.task('watchLess-agent', function () {
    gulp.watch('less/agentEditor/editor-agent.less', ['less-agentEditor-agent']);
});

gulp.task('clean_dataApi', function () {
    return gulp.src([dist + '/dataApi.min.js', dist + '/dataApi.min.js.map'], { read: false })
               .pipe(clean());
});

gulp.task('build_dataApi', ['clean_dataApi'], function () {
    return gulp.src(dataApiSrcFiles)
               .pipe(uglify())
               .pipe(concat('dataApi.min.js'))
               .pipe(gulp.dest(dist));
});

gulp.task('build_dataApi:debug', ['clean_dataApi'], function () {
    return gulp.src(dataApiSrcFiles)
               .pipe(sourcemaps.init({ sourceRoot: __dirname }))
               .pipe(concat('dataApi.min.js'))
               .pipe(sourcemaps.write('.', { sourceRoot: '/src' }))
               .pipe(gulp.dest(dist));
});

gulp.task('clean_mapRender', function () {
    return gulp.src([dist + '/mapRender.min.js', dist + '/mapRender.min.js.map'], { read: false })
               .pipe(clean());
});

gulp.task('build_mapRender', ['clean_mapRender'], function () {
    return gulp.src(mapRenderSrcFiles)
               .pipe(uglify())
               .pipe(concat('mapRender.min.js'))
               .pipe(gulp.dest(dist));
});

gulp.task('build_mapRender:debug', ['clean_mapRender'], function () {
    return gulp.src(mapRenderSrcFiles)
               .pipe(sourcemaps.init({ sourceRoot: __dirname }))
               .pipe(concat('mapRender.min.js'))
               .pipe(sourcemaps.write('.', { sourceRoot: '/src' }))
               .pipe(gulp.dest(dist));
});

gulp.task('clean_uikits', function () {
    return gulp.src([dist + '/uikits.min.js', dist + '/uikits.min.js.map'], { read: false })
               .pipe(clean());
});

gulp.task('build_uikits', ['clean_uikits'], function () {
    return gulp.src(uikitsSrcFiles)
               .pipe(uglify())
               .pipe(concat('uikits.min.js'))
               .pipe(gulp.dest(dist));
});

gulp.task('build_uikits:debug', ['clean_uikits'], function () {
    return gulp.src(uikitsSrcFiles)
               .pipe(sourcemaps.init({ sourceRoot: __dirname }))
               .pipe(concat('uikits.min.js'))
               .pipe(sourcemaps.write('.', { sourceRoot: '/src' }))
               .pipe(gulp.dest(dist));
});

gulp.task('build', function () {
    gulp.start('build_dataApi');
    gulp.start('build_mapRender');
    gulp.start('build_uikits');
});

gulp.task('build:debug', function () {
    gulp.start('build_dataApi:debug');
    gulp.start('build_mapRender:debug');
    gulp.start('build_uikits:debug');
});
