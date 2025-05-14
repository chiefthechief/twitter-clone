function generateRandomNumber(length) {
    if (length <= 0) return null; // Ensure the length is positive
    const min = Math.pow(10, length - 1); // Minimum value with the given number of digits
    const max = Math.pow(10, length) - 1; // Maximum value with the given number of digits
    return Math.floor(Math.random() * (max - min + 1)) + min; // Generate random number within the range
}

export default generateRandomNumber;  