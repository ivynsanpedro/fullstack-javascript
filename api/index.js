import express from 'express';
import { MongoClient } from 'mongodb';
import assert from 'assert';
import config from '../config';

let mdb;
MongoClient.connect(config.mongodbUri, { useNewUrlParser: true }, (err, db) => {
  assert.equal(null, err);
  mdb = db;
});

const router = express.Router();

router.get('/contests', (req, res) => {
  let contests = {};
  mdb.db('test').collection('contests').find({})
    .project({
      id: 1,
      categoryName: 1,
      contestName: 1
    })
    .forEach(contest => {
      contests[contest.id] = contest;
    }, err => {
      assert.equal(null, err);
      res.send({ contests });
    });
});

router.get('/names/:nameIds', (req, res) => {
  const nameIds = req.params.nameIds.split(',').map(Number);
  let names = {};
  mdb.db('test').collection('names').find({ id: { $in: nameIds }})
    .forEach(name => {
      names[name.id] = name;
    }, err => {
      assert.equal(null, err);
      res.send({ names });
    });
});

router.get('/contests/:contestId', (req, res) => {
  mdb.db('test').collection('contests')
    .findOne({ id: Number(req.params.contestId) })
    .then(contest => res.send(contest))
    .catch(console.error);
});

export default router;