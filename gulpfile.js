var path = require('path')
var gulp = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
var cleanCSS = require('gulp-clean-css')
var cssWrap = require('gulp-css-wrap')
// 生成各种皮肤
gulp.task('css-wrap-default', function () {
	// return gulp.src(path.resolve('./theme/dist/h_ui.css'))/* 找需要添加命名空间的css文件，支持正则表达式 */
	return gulp.src(['./src/style/theme/default/main.scss'])
		.pipe(sass())
		.pipe(rename('hui-default.css'))
		.pipe(cssWrap({
			selector: '.theme-default' /* 添加的命名空间 */
		}))
		.pipe(cleanCSS())
		.pipe(gulp.dest(path.resolve('./src/my-theme-css'))) /* 存放的目录 */
})
gulp.task('css-wrap-blue', function () {
	return gulp.src(['./src/style/theme/blue/main.scss'])
		.pipe(sass())
		.pipe(rename('hui-blue.css'))
		.pipe(cssWrap({
			selector: '.theme-blue' /* 添加的命名空间 */
		}))
		.pipe(cleanCSS())
		.pipe(gulp.dest(path.resolve('./src/my-theme-css'))) /* 存放的目录 */
})
gulp.task('css-wrap-black', function () {
	return gulp.src(['./src/style/theme/black/main.scss'])
		.pipe(sass())
		.pipe(rename('hui-black.css'))
		.pipe(cssWrap({
			selector: '.theme-black' /* 添加的命名空间 */
		}))
		.pipe(cleanCSS())
		.pipe(gulp.dest(path.resolve('./src/my-theme-css'))) /* 存放的目录 */
})
gulp.task('css-wrap-reset', function () {
	return gulp.src(['./src/style/frame/hui-reset.scss'])
		.pipe(sass())
		.pipe(rename('hui-reset.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest(path.resolve('./src/my-theme-css'))) /* 存放的目录 */
	})
// 拷贝字体(需先在./src/style中执行hui-theme init hui，保证有icon文件夹)
gulp.task('fonts', function () {
	return gulp.src('./src/style/hui/icon/iconfont.{eot,svg,ttf,woff}')
		.pipe(gulp.dest(path.resolve('./src/my-theme-css/icon'))) /* 存放的目录 */
})

gulp.task('css-wrap-all', ['css-wrap-default', 'css-wrap-blue', 'css-wrap-black','css-wrap-reset', 'fonts'])