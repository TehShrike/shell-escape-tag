const shell = require(`../`)
const test = require(`zora`)
const inspect = require(`util`).inspect

test(`is aliased to shell.protect`, t => {
	t.equal(shell.protect, shell.preserve)
})

test(`is aliased to shell.verbatim`, t => {
	t.equal(shell.verbatim, shell.preserve)
})

test(`stringifies to the unescaped string`, t => {
	t.equal(shell.preserve(`Foo Bar`).toString(), `Foo Bar`)
	t.equal(inspect(shell.preserve(`Foo Bar`)), `Foo Bar`)
})

test(`preserves a string with spaces`, t => {
	t.equal(shell.preserve(`Foo Bar`).value, `Foo Bar`)
})

test(`preserves an array of strings with spaces`, t => {
	t.equal(
		shell.preserve([ `Foo Bar`, `Baz Quux` ]).value,
		`Foo Bar Baz Quux`
	)
})

test(`preserves a string with quotes`, t => {
	t.equal(
		shell.preserve(`Foo's "Bar"`).value,
		`Foo's "Bar"`
	)
})

test(`preserves an array of strings with quotes`, t => {
	t.equal(
		shell.preserve([ `Foo's "Bar"`, `Foo 'Bar' "Baz"` ]).value,
		`Foo's "Bar" Foo 'Bar' "Baz"`
	)
})

test(`ignores null and undefined`, t => {
	t.equal(shell.preserve(null).value, ``)
	t.equal(shell.preserve(undefined).value, ``)
})

test(`ignores null and undefined array values`, t => {
	t.equal(
		shell.preserve([
			`Foo Bar`,
			null,
			undefined,
			`Baz Quux`,
		]).value,
		`Foo Bar Baz Quux`
	)
})

test(`stringifies defined values`, t => {
	t.equal(shell.preserve(``).value, ``)
	t.equal(shell.preserve(false).value, `false`)
	t.equal(shell.preserve(42).value, `42`)
})

test(`stringifies defined array values`, t => {
	t.equal(
		shell.preserve([
			`Foo Bar`,
			0,
			``,
			false,
			`Baz Quux`,
		]).value,
		`Foo Bar 0  false Baz Quux`
	)
})

test(`flattens nested array values`, t => {
	t.equal(
		shell.preserve([
			[ `Foo Bar`,
				[ 0, ``, false,
					[ null, undefined,
						[ `Baz Quux` ],
					],
				],
			],
		]).value,
		`Foo Bar 0  false Baz Quux`
	)
})

test(`preserves embedded strings`, t => {
	const verbatim = shell.preserve(`Foo Bar`)
	t.equal(shell`foo ${ verbatim }`, `foo Foo Bar`)
})

test(`preserves embedded arrays`, t => {
	const verbatim = shell.preserve([ `Foo Bar`, `Baz Quux` ])
	t.equal(shell`foo ${ verbatim }`, `foo Foo Bar Baz Quux`)
})

test(`preserves embedded nested strings/arrays`, t => {
	const verbatim = shell.preserve([
		`1 2`,
		shell.preserve(`3 4`),
		shell.preserve([ `5 6`, `7 8` ]),
		`9 10`,
	])

	t.equal(
		shell`foo ${ shell.preserve(verbatim) } bar`,
		`foo 1 2 3 4 5 6 7 8 9 10 bar`
	)
})

test(`supports embedded escapes`, t => {
	const param = shell.preserve(shell.escape(`foo bar`), [ `baz's quux` ])

	t.equal(
		shell`command ${ param }`,
		`command 'foo bar' baz's quux`
	)
})
