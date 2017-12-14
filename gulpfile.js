var gulp = require('gulp'),
watch  = require('gulp-watch'),
sass   = require('gulp-sass'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
ngAnnotate = require('gulp-ng-annotate'),
cleanCSS = require('gulp-clean-css'),
sourcemaps = require('gulp-sourcemaps'),
templateCache = require('gulp-angular-templatecache');


var js_rules = {
  merge: [
    'src/js/init.js',//put all modules first in merged js file
    'src/js/**/!(init)*.js'// then the rest, exclude the first
  ],
  in: 'public/js',
  as: 'app.min.js',
  watch: 'src/js/**/*.js',
  sourcemap: 'map'
};

var sass_rules = {
  merge: [
    'src/scss/**/*.scss'
  ],
  in: 'public/css',
  as: 'main.css',
  watch: 'src/scss/**/*.scss',
  sourcemap: 'map'
};


gulp.task('compile-templates', function () {
  return gulp.src('src/views/partials/**/*.html')
    .pipe(templateCache())
    .pipe(gulp.dest('public/js'));
});

gulp.task('sass', function () {
  return gulp.src(sass_rules.merge) // Get 'assets/scss/app.scss'
  .pipe(sourcemaps.init())
  .pipe(sass()) // SASS compile
  .pipe(concat(sass_rules.as)) // concat to main.css
  .pipe(cleanCSS({compatibility: 'ie8'})) //minify
  .pipe(sourcemaps.write(sass_rules.sourcemap))
  .pipe(gulp.dest(sass_rules.in)); 
});

gulp.task('js', function () {
  return gulp.src(js_rules.merge) // Get these files
  .pipe(sourcemaps.init())
  .pipe(concat(js_rules.as)) // concat to app.min.js
  //.pipe(ngAnnotate()) // explicity write names of dependency injected function to an array of strings. this way we dont have to repeat ourselves in code
 // .pipe(uglify()) // compress by minifying
  .pipe(sourcemaps.write(js_rules.sourcemap))
  .pipe(gulp.dest(js_rules.in)) 
});

gulp.task('copy-files',function(){
  return gulp.src([
      './src/views/pages/*.html'
  ],  {base: './src/views/pages'}) 
  .pipe(gulp.dest('./public/assets/'));
});

gulp.task('copy-files', function() {
    return gulp.src('src/views/pages/*.html')
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function () {
  gulp.watch('src/views/pages/*.html', ['copy-files']);
  gulp.watch(sass_rules.watch, ['sass']);
  gulp.watch(js_rules.watch, ['js']);
gulp.watch('src/views/partials/**/*.html', ['compile-templates']);
});

gulp.task('default', 
  ['sass',
   'js',
   'compile-templates',
   'copy-files'
  ]
);