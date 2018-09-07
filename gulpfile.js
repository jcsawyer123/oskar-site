var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var nodemon = require("gulp-nodemon");
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var autoprefixer = require('gulp-autoprefixer');

/*
    -- Top Level Functions --
    gulp.tasks - Define Tasks
    gulp.src - Points to files to use
    gulp.dest - Pointsd to output folder
    gulp.watch - Watch files and folders for changes
*/

const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

/*
    ==================================================
    Application Running
    ==================================================
*/
// Refreshes page if there are updates in the views
gulp.task('run', ['sync', 'nodemon', 'watch', 'dist'], () => {
    console.log("Application Started");
})

gulp.task('sync', () => {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        port: 3002
    });
    gulp.watch("./dist/*/*.*").on("change", browserSync.stream);
})
// Runs of the application
gulp.task('nodemon',()=> {
    return nodemon({
        script: './app.js'
    })
    .on('restart', () => {
        console.log('Restarted');
    })
});
// Watchs any scripts
gulp.task('watch', ()=> {
    gulp.watch('./src/js/*.js', ['scripts']);
    gulp.watch('./src/sass/*.scss', ['sass']);
    gulp.watch('./src/*.html', ['html']);
})

/*
    ==================================================
    SRC to Dist
    ==================================================
*/
gulp.task('dist', ['html', 'sass', 'externaljs', 'scripts'], () => {
    console.log("Files moved to dist");
})
// Moves html
gulp.task('html', () => {
    return gulp.src('./src/**/*.html')
    //.pipe(htmlmin({
     //   collapseWhitespace: true,
       // removeComments: true
      //}))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
})
gulp.task('img', () => {
    return gulp.src('./src/img/')
    .pipe(gulp.dest('./dist/img/'));
})
// Compile SASS
gulp.task('sass', () => {
    return gulp.src(["./src/sass/*.scss", "node_modules/bootstrap/scss/bootstrap.scss"])
    .pipe(sass().on('error', sass.logError))
        // Auto-prefix css styles for cross browser compatibility
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
   // .pipe(csso()) //Minify the CSS
    .pipe(gulp.dest('./dist/css'));

});
// Moves the JS required from Node Modules
gulp.task("externaljs", () => {
    return gulp.src([
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/tether/dist/js/tether.min.js"
    ])
    .pipe(gulp.dest("./dist/js/external"))
});
// Moves and minifys JS
gulp.task("scripts", ()=> {
    return gulp.src(['./src/js/**/*.js'])
    //.pipe(uglify()) // Minify JS
    .pipe(gulp.dest('./dist/js'));
})



// The main function that is ran when Gulp is started without specifying task
gulp.task("default", ["run"]);

