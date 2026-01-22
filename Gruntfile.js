// Adapted from https://gist.github.com/sebz/efddfc8fdcb6b480f567

var yaml = require("yamljs");
var S = require("string");

var CONTENT_PATH_PREFIX = "content";

module.exports = function(grunt) {
	grunt.registerTask("index", function() {
		grunt.log.writeln("Building Index");

		var indexPages = function() {
            var pagesIndex = [];

            grunt.file.recurse(CONTENT_PATH_PREFIX, function(abspath, rootdir, subdir, filename) {
            	// we only want to index actual neckers.
            	// Ignore root files and specified directories
            	if (typeof subdir == "undefined") {
            		// skip
            	} else {
            		ignoreDirs = ['about', 'neckers', 'submit', 'todo', 'unknown'];

            		thisDir = "";

            		if (S(subdir).includes("/")) {
            			splitPath = S(subdir).splitLeft("/", 1);
            			thisDir = splitPath[0];
            		} else {
            			thisDir = subdir;
            		}

	            	if (ignoreDirs.includes(thisDir)) {
	            		grunt.verbose.writeln("Ignoring:", abspath);
	            	} else {
	            		// All neckers are Markdown files
	            		if (S(filename).endsWith(".md")) {
	            			grunt.verbose.writeln("Parse file:",abspath);
	            			pagesIndex.push(processFile(abspath, filename));
	            		} else {
	            			grunt.verbose.writeln("Skipping:", abspath);
	            		}
	            	}
	            }
                
            });

            grunt.log.debug(JSON.stringify(pagesIndex));

            return pagesIndex;
        };

        var processFile = function(abspath, filename) {
        	var pageIndex;

        	var content = grunt.file.read(abspath);
        	// First separate the Front Matter from the content and parse it
            content = content.split("---");
            var frontMatter;
            try {
                frontMatter = yaml.parse(content[1].trim());
            } catch (e) {
                grunt.verbose.errorlns(e.message);
            }

            var href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(".md").s;
            // href for _index.md files stops at the folder name
            if (filename === "_index.md") {
                href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(filename).s;
            }

        	pageIndex =  {
        		href: href,
        		title: frontMatter.title
        	};

        	return pageIndex;
        }

        indexPages();
	});
};