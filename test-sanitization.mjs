// Simple test of the sanitization logic (without importing)

// Replicate the sanitization function for testing
const sanitizeEmptyStrings = (data) => {
  if (data === null || data === undefined) {
    return data
  }

  if (typeof data === 'string' && data.trim() === '') {
    return null
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeEmptyStrings(item))
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized = {}
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeEmptyStrings(value)
    }
    return sanitized
  }

  return data
}

// Test data with empty strings that should be converted to null
const testData = {
  name: 'Test Property',
  generalInformation: {
    purchasePrice: '', // Empty string should become null
    askingPrice: 500000, // Valid number should remain
    agentNotes: [
      {
        agentName: 'John Doe',
        agentNote: 'Some note',
      },
    ],
    saleHistory: [
      {
        year: '', // Empty string should become null
        value: 450000, // Valid number should remain
      },
    ],
    format: {
      bedrooms: '', // Empty string should become null
      bathrooms: 2, // Valid number should remain
    },
  },
}

console.log('Original data:')
console.log(JSON.stringify(testData, null, 2))

const sanitized = sanitizeEmptyStrings(testData)

console.log('\nSanitized data:')
console.log(JSON.stringify(sanitized, null, 2))

console.log('\nTesting complete. Empty strings should be converted to null.')
