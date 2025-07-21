const typography = require('@tailwindcss/typography');

module.exports = {
	content: ['./hugo_stats.json'],
	plugins: [typography],
	theme: {
		extend: {
	    	fontFamily: {
	    		'body': ['Oxygen', 'Helvetica', 'Arial', 'sans-serif']
	    	}
	    }
    }
};
