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

var exclude = ['js', 'css', 'img', 'fonts', 'pages'];

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

function trim_forward_slash(s) {
    return s.replace(/^\//, '')
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

gulp.task('list', () => {
    gulp.src(['./*.html'])
        .pipe(print())
})

gulp.task('html', function() {
    var folders = getFolders('./');

    folders.forEach((folder) => {
        console.log(folder);
    })
});

gulp.task('list-all', function() {
    gulp.src(['./*/*.html'])
        .pipe(print())
})

gulp.task('inject', function() {
    gulp.src('./index.html.template')
        .pipe(inject(
            gulp.src(['./*/*.html']), {
                starttag: '<!-- inject:head:{{ext}} -->',
                transform: function(filepath, file) {
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


gulp.task('pages', function() {
    let folders = getFolders('pages');
    let tasks = folders.map(function(folder) {
        return gulp.src('./index.html.template')
            .pipe(inject(
                gulp.src(path.join('pages', folder, '/*/*.html')), {
                    starttag: '<!-- inject:head:{{ext}} -->',
                    transform: function(filepath, file) {
                        let folder = filepath.split('/')[3];
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
            .pipe(rename('index_' + folder + '.html'))
            .pipe(gulp.dest('./'));
    });

    let index = gulp.src('./index.html.template')
        .pipe(inject(
            gulp.src(['./*/*.html']), {
                starttag: '<!-- inject:head:{{ext}} -->',
                transform: function(filepath, file) {
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

    tasks.unshift(index);

    return merge(tasks);

})

gulp.task('links', ['pages'], function() {
    gulp.src(['./*.html'])
        .pipe(inject(
            gulp.src(['./*.html'], {
                read: false
            }), {
                starttag: '<!-- inject:link:{{ext}} -->',
                transform: function(filepath, file) {
                    let filename = path.basename(filepath, '.html').replace(/^index\_/, '');
                    return `<li><a href="${filepath.replace(/^\/|\/$/g, '')}">${filename}</a></li>`
                }
            }
        ))
        .pipe(gulp.dest('./'));
})
