var inject = require('gulp-inject');


var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var print = require('gulp-print');

var exclude = ['js', 'css', 'img', 'fonts'];

var title_regex = new RegExp("<title>(.*?)</title>", "i");

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get_title(str) {
  try {
    return str.match(title_regex)[1];
  } catch (e) {

  }
}
function should_exclude(file) {
  return file.startsWith('.') || exclude.includes(file);
}
function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory() && !should_exclude(file);
      });
}

function get_img() {
  let i = getRandomInt(1, 6);
  return `img/thumb/${i}.png`
}


gulp.task('html', function() {
   var folders = getFolders('./');

   folders.forEach((folder) => {
     console.log(folder);
   })
});

gulp.task('list', function() {
  gulp.src(['./*/*.html'])
    .pipe(print())
})

gulp.task('inject', function() {
  gulp.src('./index.html.template')
    .pipe(inject(
      gulp.src(['./*/*.html']), {
        starttag: '<!-- inject:head:{{ext}} -->',
        transform: function (filepath, file) {
          let folder = filepath.split('/')[1];
          let title = get_title(file.contents.toString('utf8')) || 'NO TITLE';
          let img = get_img();
          return `
        <li>
          <figure>
            <a href="${filepath.replace(/^\/|\/$/g, '')}">
              <img src="${img}" alt="img"/>
            </a>
            <figcaption><h3>${folder}</h3><p>${title}</p></figcaption>
          </figure>
        </li>
          `
        }
      }
    ))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./'));
})
