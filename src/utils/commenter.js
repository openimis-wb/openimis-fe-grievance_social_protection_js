export const SYSTEM_COMMENTER = 'Système';

/**
 * The comments query returns `commenter` as a double-encoded JSON string, or null when the
 * comment has no commenter row; an already parsed object is accepted too. Always returns an
 * object, empty when the value is missing or not valid JSON.
 */
export const parseCommenter = (commenter) => {
  let value = commenter;
  try {
    while (typeof value === 'string') value = JSON.parse(value);
  } catch (e) {
    return {};
  }
  return value && typeof value === 'object' ? value : {};
};

const joinNames = (...names) => names.filter(Boolean).join(' ');

/**
 * Label of a comment's author for the printed comment list. A user or individual comment
 * without a resolvable commenter falls back to commenterFirstName/commenterLastName,
 * then to SYSTEM_COMMENTER.
 */
export const formatCommenterName = (comment) => {
  const {
    commenterTypeName, commenter, commenterFirstName, commenterLastName,
  } = comment ?? {};
  if (!commenterTypeName) return 'Anonymous User';

  const resolvedName = joinNames(commenterFirstName, commenterLastName);

  if (commenterTypeName === 'individual') {
    const { firstName, lastName } = parseCommenter(commenter);
    const name = joinNames(firstName, lastName) || resolvedName;
    return name ? `Individual: ${name}` : SYSTEM_COMMENTER;
  }

  if (commenterTypeName === 'user') {
    const name = parseCommenter(commenter).username || resolvedName;
    return name ? `User: ${name}` : SYSTEM_COMMENTER;
  }

  return commenterTypeName;
};
