let scrolledToTheEnd = false

const hasScrolledToTheEnd = () => scrolledToTheEnd

const setScrolledToTheEnd = ( value ) => {
	scrolledToTheEnd = value
}

export {
	hasScrolledToTheEnd,
	setScrolledToTheEnd
}
