/**
 * MemorySerializer.js
 * 
 * Manages serialization, format conversions, exports, and imports
 * of the learner memory payload.
 * 
 * Pure functions only.
 */

/**
 * Serializes the memory object to a JSON string.
 * @param {Object} memory 
 * @returns {string} JSON string
 */
export function serializeMemory(memory) {
  return JSON.stringify(memory, null, 2);
}

/**
 * Deserializes a JSON string into a memory object.
 * @param {string} serialized 
 * @returns {Object} Memory state
 */
export function deserializeMemory(serialized) {
  try {
    return JSON.parse(serialized);
  } catch (err) {
    console.error("Failed to deserialize memory:", err);
    return null;
  }
}

/**
 * Formats memory breakthrough and architect moments to Markdown.
 * @param {Object} memory 
 * @returns {string} Markdown document string
 */
export function exportToMarkdown(memory) {
  let md = `# Software Universe - Learner Journey Portfolio\n\n`;
  md += `## Profile Info\n`;
  md += `* **Learning Style:** ${memory?.profile?.learningStyle || "Systems thinker"}\n`;
  md += `* **Preferred Mode:** ${memory?.profile?.preferredExplanationMode || "MENTAL_MODEL"}\n\n`;

  md += `## Breakthrough Moments\n`;
  if (memory?.breakthroughMoments && memory.breakthroughMoments.length > 0) {
    memory.breakthroughMoments.forEach(bt => {
      md += `### ${bt.concept.toUpperCase()} (${new Date(bt.timestamp).toLocaleDateString()})\n`;
      md += `* ${bt.note}\n\n`;
    });
  } else {
    md += `*No breakthroughs logged yet.*\n\n`;
  }

  md += `## Architect Transformations\n`;
  if (memory?.architectMoments && memory.architectMoments.length > 0) {
    memory.architectMoments.forEach(am => {
      md += `### ${am.concept.toUpperCase()} (${new Date(am.timestamp).toLocaleDateString()})\n`;
      md += `* ${am.note}\n\n`;
    });
  } else {
    md += `*No architect moments logged yet.*\n\n`;
  }

  return md;
}
