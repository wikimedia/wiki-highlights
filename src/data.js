import data from './data.json';

function shuffleArray ( array ) {
    for ( let i = array.length - 1; i > 0; i-- ) {
        const j = Math.floor( Math.random() * ( i + 1 ) );
        [ array[i], array[j] ] = [ array[j], array[i] ];
    }
}

function groupBy ( xs, key ) {
	return xs.reduce( function ( rv, x ) {
		( rv[ x[ key ] ] = rv[ x[ key ] ] || [] ).push( x );
		return rv;
	}, {} );
}

shuffleArray( data.articles );
const categories = groupBy( data.articles, 'category' );

const getArticle = function ( title ) {
	return data.articles.find( ( a ) => a.title === title );
};

const getArticlesExcept = function( category, total ) {
	if ( total === 0 ) return [];

	const articles = [];
	let index = 0;
	while( articles.length < total ) {
		if ( data.articles[ index ].category !== category ) {
			articles.push( data.articles[ index ] );
		}
		index++;
	}

	return articles;
}
export { categories, getArticle, getArticlesExcept };
