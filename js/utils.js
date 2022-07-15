module.exports = {
    alphanumeric2Color: (string) => {
        // Sum ASCII values
        let string2Number = Array.from(string).map(c => c.charCodeAt()).reduce((a,b) => a + b, 0);
        
        // Multiply by prime numbers and module to 255
        let color = {
            "r": string2Number*2%255,
            "g": string2Number*13%255,
            "b": string2Number*37%255
        }

        return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }
};