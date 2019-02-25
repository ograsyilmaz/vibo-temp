var gulp = require("gulp"),
    sass = require("gulp-sass"),
    uglify_js = require("gulp-uglifyjs"),
    minify = require("gulp-minify"),
    file_include = require("gulp-file-include"),
    concat_css = require("gulp-concat-css"),
    concat = require("gulp-concat"),
    minify_css = require("gulp-minify-css"),
    rename = require("gulp-rename"),
    plumber = require('gulp-plumber'),
    htmlmin = require('gulp-htmlmin'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require("browser-sync"),
    image = require('gulp-image');




var public_dir = "public/",
    assets_dir = public_dir + "assets/",
    assets_css_dir = public_dir + "assets/css/",
    assets_js_dir = public_dir + "assets/js/",
    assets_img_dir = public_dir + "assets/img/",
    assets_font_dir = public_dir + "assets/font/",
    dev_dir = "dev/",
    dev_js_dir = "dev/js/",
    dev_layouts_dir = "dev/layouts/",
    dev_pages_dir = "dev/pages/",
    dev_font_dir = "dev/font/",
    dev_scss_dir = "dev/scss/",
    dev_img_dir = "dev/img/**",
    dev_scss_sub_dir = "dev/scss/*/",

    dev_vendor_dir = "dev/vendor/";
dev_scss_sub_dir_watch = "dev/scss/**/",




    /* 
    Gorev I : sass

    Ana sass dosyasini (dev/scss/main.scss) css'e cevir ve cevirilen css dosyasini minify edilip public/assets/css klasorune main.min.css olarak kaydedilmesi.

    */

    gulp.task("sass", function () {
        return gulp.src(dev_scss_dir + "main.scss")
            .pipe(plumber({
                errorHandler: function (error) {
                    console.log(error.message);
                    this.emit('end');
                }
            }))
            .pipe(sass())
            .pipe(autoprefixer('last 2 versions'))
            .pipe(minify_css({
                compatibility: 'ie8'
            }))
            .pipe(sass().on('error', sass.logError))

            .pipe(rename('main.min.css'))
            .pipe(gulp.dest(assets_css_dir))
            .pipe(browserSync.reload({stream:true}));

    });




/* 

Gorev II : minify_js

dev/js içinde bulunan tüm dosyaları alıp minify ederek public/assets/js içine kaydeder, uzantılarından önce ".min" ekler

*/
gulp.task('browser-sync', function () {
    browserSync.init({
        notify: false,
        server: {
            baseDir: './',
            index: "Home.html"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task("minify_js", function () {
    return gulp.src(dev_js_dir + "*.js")
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(minify({
            ext: {
                src: false,
                min: '.min.js'
            },
            noSource: "*"
        }))
        .pipe(gulp.dest(assets_js_dir))
        .pipe(browserSync.reload({stream:true}));
});




/* 

Gorev IV : plugins_js

Kullanilan eklentilerde bulunan javascriptlerin (dev/vendor) birlestirilip public/assets/js klasorune plugins.min.js olarak kaydedilmesi.

*/


gulp.task("plugins_js", function () {
    /*return gulp.src()
    .pipe(concat("plugins.min.js"))
    .pipe(uglify_js())
    .pipe(gulp.dest(assets_js_dir));
    */
});


/* 

Gorev IV : resim_min

Kullanilan eklentilerde bulunan javascriptlerin (dev/vendor) birlestirilip public/assets/js klasorune plugins.min.js olarak kaydedilmesi.

*/



gulp.task('image', function () {
    gulp.src(dev_img_dir + '/*')
        .pipe(image())
        .pipe(gulp.dest(assets_img_dir));
});



/* 

Gorev V : plugins_css

Kullanilan eklentilerde bulunan css'lerin (dev/vendor) birlestirilip public/assets/css klasorune plugins.min.css olarak kaydedilmesi.

*/

gulp.task("plugins_css", function () {
    /*
    return gulp.src()
    .pipe(concat_css("plugins.min.css"))
    .pipe(minify_css({
        compatibility: 'ie8'
    }))
    .pipe(gulp.dest(assets_css_dir));
    */
});





/* 
Gorev VI : bootstrap

Bootstrap kutuphanesinin ozellestirilmis sass dosyalarının css e cevirilip public/assets/css klasorune bootstap.min.css olarak kaydedilmesi.

*/

gulp.task("bootstrap", function () {
    return gulp.src(dev_scss_dir + "bootstrap.scss")
        .pipe(sass())
        .pipe(minify_css({
            compatibility: 'ie8'
        }))

        .pipe(rename('bootstrap.min.css'))
        .pipe(gulp.dest(assets_css_dir));
});





/* 
Gorev VII : file_include

Parcalanmis html sablonlarini birlestirilmesi ve /public dizinine kaydedilmesi.

*/

gulp.task('file_include', function () {
    return gulp.src(dev_pages_dir + "*.html")
        .pipe(file_include({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyJS: true
        }))
        .pipe(gulp.dest(public_dir));
});


gulp.task('fonts', function () {
    return gulp.src([
            dev_font_dir + "*"
        ])
        .pipe(gulp.dest(assets_font_dir));
});


/* 

Degisiklik yapildikca calisacak gorevler

Gorev I (sass),
Gorev II (external_js),
Gorev III (main_js),
Gorev VI (bootstrap)
Gorev VII (file_include)

*/

gulp.task("watch", function () {
    gulp.watch(dev_scss_sub_dir_watch + "*.scss", ['sass']);
    gulp.watch(dev_js_dir + "*.js", ['minify_js']);
    gulp.watch(dev_scss_dir + "bootstrap/*.scss", ['bootstrap']);
    gulp.watch(dev_pages_dir + "*.html", ['file_include']);
    gulp.watch(dev_layouts_dir + "*.html", ['file_include']);
    gulp.watch(dev_layouts_dir + "*/*.html", ['file_include']);
    gulp.watch(dev_img_dir + "/*", ['image']);
    gulp.watch(public_dir+"*.html", ['bs-reload']);
});




        /* 

        Varsayilan olarak calistarilacak gorevler

        Gorev I (sass),
        Gorev II (external_js),
        Gorev III (main_js),
        Gorev IV (plugins_js)
        Gorev V (plugins_css)
        Gorev VI (bootstrap)
        Gorev VII (file_include)

        */



        gulp.task("default", ["watch", "sass", "minify_js", "plugins_js", "fonts", "plugins_css", "bootstrap", "file_include", "image", "browser-sync"]);