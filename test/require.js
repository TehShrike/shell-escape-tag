const test = require(`zora`)

test(`require without .default`, t => {
	const shell = require(`../src/shell-escape-tag`)
	const files = [ `foo bar.gif`, `baz quux.png` ]
	t.equal(shell`compress ${ files }`, `compress 'foo bar.gif' 'baz quux.png'`)
})
