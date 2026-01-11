class DataStore {
  constructor() {
    this.users = new Map();
    this.goals = new Map();
    this.habits = new Map();

    // Forum collections
    this.forumPosts = new Map();
    this.forumComments = new Map();
    this.forumVotes = new Map();
    this.forumNotifications = new Map();

    this.steps = new Map();
  }

  create(collection, id, data) {
    if (!this[collection]) throw new Error(`Collection ${collection} does not exist`);
    this[collection].set(id, { id, ...data });
    return this[collection].get(id);
  }

  findById(collection, id) {
    return this[collection]?.get(id) || null;
  }

  findAll(collection, filter = {}) {
    if (!this[collection]) throw new Error(`Collection ${collection} does not exist`);
    const items = Array.from(this[collection].values());
    return items.filter(item => {
      for (let key in filter) {
        if (item[key] !== filter[key]) return false;
      }
      return true;
    });
  }

  update(collection, id, newData) {
    if (!this[collection]) throw new Error(`Collection ${collection} does not exist`);
    const item = this[collection].get(id);
    if (!item) return null;
    this[collection].set(id, { ...item, ...newData });
    return this[collection].get(id);
  }

  delete(collection, id) {
    if (!this[collection]) throw new Error(`Collection ${collection} does not exist`);
    return this[collection].delete(id);
  }

  // ---- Add this method ----
  findByEmail(email) {
    const users = Array.from(this.users.values());
    return users.find(user => user.email === email) || null;
  }

  findStepsByGoal(goalId) {
    if (!this.steps) return [];
    return Array.from(this.steps.values()).filter(step => step.goalId === goalId);
  }

  findGoalsByUser(userId) {
    if (!this.goals) return [];
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId);
  }
}

module.exports = new DataStore();
