// Adapted from https://gist.github.com/sebz/efddfc8fdcb6b480f567

var yaml = require("yamljs");
var toml = require("toml");
var S = require("string");
var lunr = require("lunr");

var allColours = {};

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

            grunt.log.ok("Document Array Built")
            return pagesIndex;
        };

        var populateAllColours = function() {
			var config = toml.parse(grunt.file.read("hugo.toml"));

			for (const name in config.params.colours) {
				allColours[name] = config.params.colours[name].basic;
			}
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

            matches = frontMatter.title.match(/\d+/);
            if (matches) {
            	groupNumber = matches[0];
            } else {
            	groupNumber = "";
            }

        	pageIndex =  {
        		href: href,
        		title: frontMatter.title,
        		number: groupNumber,
        		colours: processColours(frontMatter)
        	};

        	return pageIndex;
        };

        var processColours = function(frontMatter) {
        	var colours = [];

        	if ("main" in frontMatter.params) {
        		colours.push(...allColours[frontMatter.params.main]);
        	}
        	if("outerBorder" in frontMatter.params) {
        		colours.push(...allColours[frontMatter.params.outerBorder]);
        	}
        	if ("middleBorder" in frontMatter.params) {
        		colours.push(...allColours[frontMatter.params.middleBorder]);
        	}
        	if ("innerBorder" in frontMatter.params) {
        		colours.push(...allColours[frontMatter.params.innerBorder]);
        	}
			if ("leftOuterBorder" in frontMatter.params) {
        		colours.push(...allColours[frontMatter.params.leftOuterBorder]);
        	}
			if ("rightOuterBorder" in frontMatter.params) {
        		colours.push(...allColours[frontMatter.params.rightOuterBorder]);
        	}
			if ("leftMiddleBorder" in frontMatter.params) {
        		colours.push(...allColours[frontMatter.params.leftMiddleBorder]);
        	}
			if ("rightMiddleBorder" in frontMatter.params) {
        		colours.push(...allColours[frontMatter.params.rightMiddleBorder]);
        	}
			if ("leftInnerBorder" in frontMatter.params) {
        		colours.push(...allColours[frontMatter.params.leftInnerBorder]);
        	}
			if ("rightInnerBorder" in frontMatter.params) {
        		colours.push(...allColours[frontMatter.params.rightInnerBorder]);
        	}
			if ("leftMain" in frontMatter.params) {
        		colours.push(...allColours[frontMatter.params.leftMain]);
        	}
			if ("rightMain" in frontMatter.params) {
        		colours.push(...allColours[frontMatter.params.rightMain]);
        	} 
			if ("centre" in frontMatter.params) {
        		colours.push(...allColours[frontMatter.params.centre]);
        	}

        	return [...new Set(colours)];
        };



        populateAllColours();
        
        idx = lunr(function() {
        	this.ref('href');
        	this.field('title');
        	this.field('number');
        	this.field('colours');

        	indexPages().forEach(function (doc) {
        		this.add(doc)
        	}, this);
        });

        grunt.file.write("assets/js/lunr/pages_index.js", "var idx = lunr.Index.load(JSON.parse(`" + JSON.stringify(idx) + "`));");
        grunt.log.ok("Index built");
	});
};