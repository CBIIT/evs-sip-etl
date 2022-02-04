/**
 * Map of MDB Relationship fields to GDC YAML fields
 */
const relationshipMap = {
  desc: 'description',
  dst: 'target_type',
  handle: 'label',
  is_required: 'required',
  multiplicity: 'multiplicity',
  nanoid: 'nanoid',
  src: null
};

export default relationshipMap;