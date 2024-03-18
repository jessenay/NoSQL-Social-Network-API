const User = require('../models/User');
const Thought = require('../models/Thought');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .select('-__v')
      .sort({ _id: -1 })
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  getThoughtById(req, res) {
    Thought.findById(req.params.id)
      .select('-__v')
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findByIdAndUpdate(
          req.body.userId,
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'Thought created, but found no user with that id' });
        }
        res.json({ message: 'Thought successfully created!' });
      })
      .catch((err) => res.status(500).json(err));
  },

  updateThought(req, res) {
    Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  deleteThought(req, res) {
    Thought.findByIdAndDelete(req.params.id)
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return User.findByIdAndUpdate(
          thought.username,
          { $pull: { thoughts: req.params.id } },
          { new: true }
        );
      })
      .then(() => res.json({ message: 'Thought successfully deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  addReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  removeReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  }
};

module.exports = thoughtController;
