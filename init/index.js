const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("C:/Users/TheYashvardhan/Desktop/map/ac/majorproject/models/listing.js");

const mongo_url='mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
console.log(err);
});


async function main(){
    await mongoose.connect(mongo_url);
};

const initDB = async()=>{
    await listing.deleteMany({});
    initData.data = initData.data.map(obj => ({ ...obj, owner: "662e95082d2276185c20fcc8" }));
    await listing.insertMany(initData.data);
    console.log("data was initialised");
};

initDB();