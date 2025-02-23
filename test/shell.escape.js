const shell = require(`../`)
const test = require(`zora`)

test(`stringifies to the escaped string`, t => {
	t.equal(shell.escape(`Foo Bar`).toString(), `'Foo Bar'`)
	// t.equal(inspect(shell.escape(`Foo Bar`)), `'Foo Bar'`)
})

test(`escapes a string with spaces`, t => {
	t.equal(shell.escape(`Foo Bar`).value, `'Foo Bar'`)
})

test(`escapes an array of strings with spaces`, t => {
	t.equal(
		shell.escape([ `Foo Bar`, `Baz Quux` ]).value,
		`'Foo Bar' 'Baz Quux'`
	)
})

test(`escapes a string with quotes`, t => {
	t.equal(
		shell.escape(`Foo's "Bar"`).value,
		`'Foo'"'"'s "Bar"'`
	)
})

test(`escapes an array of strings with quotes`, t => {
	t.equal(
		shell.escape([ `Foo's "Bar"`, `Foo 'Bar' "Baz"` ]).value,
		`'Foo'"'"'s "Bar"' 'Foo '"'"'Bar'"'"' "Baz"'`
	)
})

test(`ignores null and undefined`, t => {
	t.equal(shell.escape(null).value, ``)
	t.equal(shell.escape(undefined).value, ``)
})

test(`ignores null and undefined array values`, t => {
	t.equal(
		shell.escape([
			`Foo Bar`,
			null,
			undefined,
			`Baz Quux`,
		]).value,
		`'Foo Bar' 'Baz Quux'`
	)
})

test(`stringifies defined values`, t => {
	t.equal(shell.escape(``).value, `''`)
	t.equal(shell.escape(false).value, `false`)
	t.equal(shell.escape(42).value, `42`)
})

test(`stringifies defined array values`, t => {
	t.equal(
		shell.escape([
			`Foo Bar`,
			0,
			``,
			false,
			`Baz Quux`,
		]).value,
		`'Foo Bar' 0 '' false 'Baz Quux'`
	)
})

test(`flattens nested array values`, t => {
	t.equal(
		shell.escape([
			[ `Foo Bar`,
				[ 0, ``, false,
					[ null, undefined,
						[ `Baz Quux` ],
					],
				],
			],
		]).value,
		`'Foo Bar' 0 '' false 'Baz Quux'`
	)
})

test(`doesn't escape embedded escaped strings`, t => {
	const escaped = shell.escape(`Foo Bar`)
	t.equal(shell`foo ${ escaped }`, `foo 'Foo Bar'`)
})

test(`doesn't escape embedded escaped arrays`, t => {
	const escaped = shell.escape([ `Foo Bar`, `Baz Quux` ])
	t.equal(shell`foo ${ escaped }`, `foo 'Foo Bar' 'Baz Quux'`)
})

test(`doesn't escape embedded nested strings/arrays`, t => {
	const escaped = shell.escape([
		`1 2`,
		shell.escape(`3 4`),
		shell.escape([ `5 6`, `7 8` ]),
		`9 10`,
	])

	t.equal(
		shell`foo ${ shell.escape(escaped) } bar`,
		`foo '1 2' '3 4' '5 6' '7 8' '9 10' bar`
	)
})

test(`supports embedded preserves`, t => {
	const param = shell.escape(shell.preserve(`foo bar`), [ `baz's quux` ])

	t.equal(
		shell`command ${ param }`,
		`command foo bar 'baz'"'"'s quux'`
	)
})
