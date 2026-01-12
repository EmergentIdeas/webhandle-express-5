export default async function wait(millis) {
	let pr = new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve()
		}, millis)

	})
	return pr
}