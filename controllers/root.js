const root = (req, res) => {
  res.status(200).json({ message: 'Server works properly' });
};

export default root;
