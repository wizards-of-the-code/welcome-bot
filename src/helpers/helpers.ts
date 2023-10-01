export const hasObjectKey = (obj: unknown, key: string): boolean => {
	if (obj instanceof  Object) {
		Object.prototype.hasOwnProperty.call(obj, key)
	}
	return false
}
