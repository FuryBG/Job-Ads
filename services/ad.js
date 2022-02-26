const Ad = require("../models/Ad");

async function getAll() {
    const allAdds = await Ad.find({}).populate("owner").lean();
    return allAdds;
};

async function getById(id) {
    const current = await Ad.findById(id).populate("owner").populate("subscribed").lean();
    return current;
};

async function create(data) {
    const newAd = new Ad(data);
    await newAd.save();
    return newAd;
};

async function edit(adId, data) {
    let currAd = await Ad.findById(adId);
    let newAd = Object.assign(currAd, data);
    await newAd.save();
};

async function del(adId) {
    await Ad.findByIdAndDelete(adId);
};

async function addApply(adId, userId) {
    let currAd = await Ad.findById(adId);
    currAd.subscribed.push(userId);
    currAd.save();
};


module.exports = {
    getAll,
    getById,
    create,
    edit,
    del,
    addApply
};