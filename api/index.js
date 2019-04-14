import express from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import assert from 'assert';
import config from '../config';

let mdb;
MongoClient.connect(config.mongodbUri, { useNewUrlParser: true }, (err, db) => {
  assert.equal(null, err);
  mdb = db.db('test');
});

const router = express.Router();

router.get('/contests', (req, res) => {
  let contests = {};
  mdb.collection('contests').find({})
    .project({
      categoryName: 1,
      contestName: 1
    })
    .forEach(contest => {
      contests[contest._id] = contest;
    }, err => {
      assert.equal(null, err);
      res.send({ contests });
    });
});

router.get('/names/:nameIds', (req, res) => {
  const nameIds = req.params.nameIds.split(',').map(ObjectID);
  let names = {};
  mdb.collection('names').find({ _id: { $in: nameIds }})
    .forEach(name => {
      names[name._id] = name;
    }, err => {
      assert.equal(null, err);
      res.send({ names });
    });
});

router.get('/contests/:contestId', (req, res) => {
  mdb.collection('contests')
    .findOne({ _id: ObjectID(req.params.contestId) })
    .then(contest => res.send(contest))
    .catch(error => {
      console.error(error);
      res.status(404).send('Bad Request');
    });
});

router.post('/names', (req, res) => {
  const contestId = ObjectID(req.body.contestId);
  const name = req.body.newName;
  // validdation ...
  mdb.collection('names').insertOne({ name }).then(result =>
    mdb.collection('contests').findAndModify(
      { _id: contestId },
      [],
      { $push: { nameIds: result.insertedId } },
      { new: true}
    ).then(doc =>
      res.send({
        updatedContest: doc.value,
        newName: { _id: result.insertedId, name }
      })
    )
  )
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});

export default router;