/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomInt = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const hoursToMinutes = (hours: number) => hours * 60;
export const secondsToMs = (seconds: number) => seconds * 1000;

export const calculateUntilDate = (hours: number) =>
	Date.now() / 1000 + hoursToMinutes(hours) * 60;
