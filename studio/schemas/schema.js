// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    {
      name: 'txTracker',
      title: 'Transaction Tracker',
      type: 'document',
      fields: [

        {
          name: 'from',
          title: 'From',
          type: 'string'
        },
        {
          name: 'to',
          title: 'To',
          type: 'string'
        },
        {
          name: 'contract',
          title: 'Contract',
          type: 'string',
        },
        {
          name: 'coin',
          title: 'Crypto',
          type: 'string'
        },
        {
          name: 'amount',
          title: 'Amount',
          type: 'number'
        },
        {
          name: 'status',
          title: 'Status',
          type: 'string'
        }
      ]
    },
  ]),
})

