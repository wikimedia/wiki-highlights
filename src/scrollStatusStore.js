let scrolledToTheEnd = false

const hasScrolledToTheEnd = () => scrolledToTheEnd

const setScrolledToTheEnd = ( value ) => {
	if ( scrolledToTheEnd !== value ) {
		scrolledToTheEnd = value
	}

}

export {
	hasScrolledToTheEnd,
	setScrolledToTheEnd
}
