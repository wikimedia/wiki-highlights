import data from './data.json';

const groupBy = function ( xs, key ) {
	return xs.reduce( function ( rv, x ) {
		( rv[ x[ key ] ] = rv[ x[ key ] ] || [] ).push( x );
		return rv;
	}, {} );
};
const categories = groupBy( data.articles, 'category' );

const getArticle = function ( title ) {
	return data.articles.find( ( a ) => a.title === title );
};

export { categories, getArticle };
