<html>
	<head>
		<meta charset="utf-8">
		<title>
			{{ title }}
		</title>
	</head>
	<body>
		{{#each files}}
		    <a href="{{../dir}}/{{file}}">【{{icon}}】{{file}}</a>
		{{/each}}
	</body>
</html>




