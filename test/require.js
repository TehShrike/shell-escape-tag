const test = require(`zora`)

test(`require without .default`, t => {
	const shell = require(`../`)
	const files = [ `foo bar.gif`, `baz quux.png` ]
	t.equal(shell`compress ${ files }`, `compress 'foo bar.gif' 'baz quux.png'`)
})
