const { Vaccine, VaccineLot, UserVaccine } = require("../models");

exports.create = async (req, res) => {
  try {
    const newVaccine = new Vaccine({
      name: req.body.name,
    });
    const savedVaccine = await newVaccine.save();
    savedVaccine._doc.quantity = 0;
    savedVaccine._doc.vaccinated = 0;
    savedVaccine._doc.vaccineLots = [];
    res.status(201).json(savedVaccine);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getAll = async (req, res) => {
  try {
    const list = await Vaccine.find({}).sort("-createdAt");
    for (const vaccine of list) {
      const vaccineLots = await VaccineLot.find({ vaccine: vaccine._id });
      vaccine._doc.quantity = vaccineLots.reduce(
        (total, item) => total + Number(item.quantity),
        0
      );
      vaccine._doc.vaccinated = vaccineLots.reduce(
        (total, item) => total + Number(item.vaccinated),
        0
      );
      vaccine._doc.vaccineLots = vaccineLots;
    }
    res.status(200).json(list);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
// create func get all user vaccineted in last 24h
exports.getAll24hUser = async (req, res) => {
  try {
    const list = await UserVaccine.find({
      createdAt: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    }).populate([
      {
        path: "vaccine",
      },
      {
        path: "vaccineLot",
      },
      {
        path: "user",
      },
    ]);
    // if user have more than 1 vaccine in 24h render unique one user
    const uniqueList = list.reduce((acc, item) => {
      if (
        !acc.find((x) => x.user._id.toString() === item.user._id.toString())
      ) {
        acc.push(item);
      }
      return acc;
    }, []);
    res.status(200).json(uniqueList);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getOne = async (req, res) => {
  try {
    const vaccine = await Vaccine.findById(req.params.id);
    const vaccineLots = await VaccineLot.find({ vaccine: vaccine._id });
    vaccine._doc.quantity = vaccineLots.reduce(
      (total, item) => total + Number(item.quantity),
      0
    );
    vaccine._doc.vaccinated = vaccineLots.reduce(
      (total, item) => total + Number(item.vaccinated),
      0
    );
    vaccine._doc.vaccineLots = vaccineLots;
    res.status(200).json(vaccine);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  try {
    const vaccine = await Vaccine.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(vaccine);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.delete = async (req, res) => {
  try {
    await VaccineLot.deleteMany({ vaccine: req.params.id });
    await UserVaccine.deleteMany({ vaccine: req.params.id });
    await Vaccine.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
