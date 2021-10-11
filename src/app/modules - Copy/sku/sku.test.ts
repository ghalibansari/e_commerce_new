
import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../../app'
let should = chai.should();
chai.use(chaiHttp);
import mongoose from 'mongoose'

//login token
let authKey = '<token>'
// describe('Array...[Demo]', function() {
//     it('should start empty', function() {
//       var arr = [];
//       arr.length.should.be.eql(0)
//     });
//   });

// });
//Todo change DB name
describe('test Mongo Db', function () {
    //@ts-ignore //Todo remove this line...
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb+srv://infinity2020:infinity2020@infinity.7kj2a.gcp.mongodb.net/infinity_dev_qc?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, });
    mongoose.connection
        .once('open', () => console.log('<<<<<<<<<<<   ========[ Mongo DB Connected ]======== >>>>>>>>>>>>>'))
        .on('error', (error) => {
            console.warn('Mongo Connection Error : ', error);
        });
});

describe('SKU module Apis', () => {

    it("GET /api/v1/sku/", (done) => {
        chai.request(app)
            .get("/api/v1/sku/")
            .set('authorization', authKey)
            .end((err, res) => {
                //   console.log("***RES",res.body);
                res.should.have.status(200)
                res.body.should.be.a('object');
                res.body.status.should.equal(true)
                res.body.data.should.be.a('array')
                res.body.data.length.should.not.equal(0)
                done()
            })
       // done();
    })
    //})

    //describe('Reading user details by _id', () => {
    it("GET /api/v1/sku/get-by-id", (done) => {
        let _id = '5f5731dbb9e60f381c458d0c'
        chai.request(app)
            .get('/api/v1/sku/get-by-id?_id=' + _id)
            .set('authorization', authKey)
            .end((err, res) => {
                //console.log("***  RES =====>",res.body);
                res.should.have.status(200)
                res.body.should.be.a('object');
                res.body.status.should.equal(true)
                res.body.data.should.be.a('object')
                res.body.should.have.property('message').eql('Fetch Successful');
                res.body.data.should.have.property('isActive').eql(true);
                // console.log("byId",res.body.data);
                done()

            })
        //done();
    })
})

describe('Reading sku details by index', () => {
    it("GET /api/v1/sku/index", (done) => {
        chai.request(app)
            .get('/api/v1/sku/index')
            .set('authorization', authKey)
            .end((err, res) => {
                //console.log("***  RES =====>",res.body);
                res.should.have.status(200)
                res.body.should.be.a('object');
                res.body.status.should.equal(true)
                res.body.data.should.be.a('array')
                res.body.should.have.property('message').eql('Fetch Successful');
                // console.log("byId",res.body.data);
                done()

            })
        //done();
    })
})
describe('Reading sku details by filterCriteria', () => {
    it("GET /api/v1/sku/filterCriteria", (done) => {
        chai.request(app)
            .get('/api/v1/sku/filterCriteria')
            .set('authorization', authKey)
            .end((err, res) => {
                //console.log("***  RES =====>",res.body);
                res.should.have.status(200)
                res.body.should.be.a('object');
                res.body.status.should.equal(true)
                res.body.data.should.be.a('object')
                res.body.should.have.property('message').eql('Fetch Successful');
                // console.log("byId",res.body.data);
                done()

            })
        //done();
    })
})

describe('count sku details by params', () => {
    it("GET /api/v1/sku/count", (done) => {
        chai.request(app)
            .get('/api/v1/sku/count')
            .set('authorization', authKey)
            .query({count:'[{"key":"movementStatus","value":"ARRIVAL"}]'})  //Add query params
            .end((err, res) => {
                //console.log("***  RES =====>",res.body);
                res.should.have.status(200)
                res.body.should.be.a('object');
                res.body.status.should.equal(true)
                res.body.data.should.be.a('object')
                res.body.should.have.property('message').eql('Fetch Successful');
                // console.log("SKU-count",res.body.data);
                done()

            })
        //done();
    })
})

describe('GroupBy sku details based on params', () => {
    it("GET /api/v1/sku/group-by", (done) => {
        chai.request(app)
            .get('/api/v1/sku/group-by')
            .set('authorization', authKey)
            .query({key:'["shape", "clarity", "colorType", "labShape", "colorCategory"]',companyId:'5f3e2a9335ebe9003c84b93f'})  //Add query params
            .end((err, res) => {
                //console.log("***  RES =====>",res.body);
                res.should.have.status(200)
                res.body.should.be.a('object');
                res.body.status.should.equal(true)
                res.body.data.should.be.a('array')
                res.body.should.have.property('message').eql('Fetch Successful');
                // console.log("SKU-groupBy",res.body.data);
                done()

            })
        //done();
    })
})

describe('sku Asset details by skuId', () => {
    it("GET /api/v1/sku/assetDetail", (done) => {
        chai.request(app)
            .get('/api/v1/sku/assetDetail')
            .set('authorization', authKey)
            .query({_id:'5f914db4cf454b64d2648651'})  //Add query params
            .end((err, res) => {
                //console.log("***  RES =====>",res.body);
                res.should.have.status(200)
                res.body.should.be.a('object');
                res.body.status.should.equal(true)
                res.body.data.should.be.a('object')
                res.body.should.have.property('message').eql('Fetch Successful');
                //console.log("SKU-Asset detail",res.body.data);
                done()

            })
        //done();
    })
})

describe('sku unReferencedAssets details', () => {
    it("GET /api/v1/sku/unreferenced/assets", (done) => {
        chai.request(app)
            .get('/api/v1/sku/unreferenced/assets')
            .set('authorization', authKey)
            //.query({_id:'5f914db4cf454b64d2648651'})  //Add query params
            .end((err, res) => {
                //console.log("***  RES =====>",res.body);
                res.should.have.status(200)
                res.body.should.be.a('object');
                res.body.status.should.equal(true)
                res.body.data.should.be.a('array')
                res.body.should.have.property('message').eql('Fetch Successful');
                //console.log("SKU-Asset detail",res.body.data);
                done()

            })
        //done();
    })
})

describe('sku details get-by-tagNo', () => {
    it("GET /api/v1/sku/get-by-tag", (done) => {
        chai.request(app)
            .get('/api/v1/sku/get-by-tag')
            .set('authorization', authKey)
            .query({tagNo:'3020668004'})  //Add query params
            .end((err, res) => {
                //console.log("***  RES =====>",res.body);
                res.should.have.status(200)
                res.body.should.be.a('object');
                res.body.status.should.equal(true)
                res.body.data.should.be.a('array')
                res.body.should.have.property('message').eql('Fetch Successful');
                //console.log("SKU-detail by tagNo",res.body.data);
                done()

            })
        //done();
        //setTimeout(done, 5000);
    })
})

describe('sku details from Date&Time', () => {
    it("GET /api/v1/sku/getSkuByDateAndTime", (done) => {
        chai.request(app)
            .get('/api/v1/sku/getSkuByDateAndTime')
            .set('authorization', authKey)
            .query({date:'2020-09-27T13:01:35.347+00:00'})  //Add query params
            .end((err, res) => {
                //console.log("***  RES =====>",res.body);
                res.should.have.status(200)
                res.body.should.be.a('object');
                res.body.status.should.equal(true)
                res.body.data.should.be.a('array')
                res.body.should.have.property('message').eql('Fetch Successful');
                //console.log("SKU-detail by date",res.body.data);
                done()

            })
       // done();
    })
})

describe('sku LED trigger..', () => {
    
    it("post /api/v1/sku/ledTrigger", (done) => {
            let body = {
                "skuIds": [
                    "5f40ad2355e40c38c45a7369",
                    "5f40ad2355e40c38c45a736d"
                ],
                "status": "LED"
            };
            chai.request(app)
                .post('/api/v1/sku/ledTrigger')
                .set('authorization', authKey)
                .send(body)
                .end((err, res) => {
                    //  console.log("***  RES =====>",res.body);

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status')
                    if(err){
                        console.log("***  ERROR =====>\n",err);
                        done(err)
                    }else{
                        console.log("***  MESSAGE =====>",res.body.message);
                        done();
                    }
                    res.body.status.should.equal(true)
                    res.body.should.have.property('message').eql('device triggered successfully');
                    // res.body.data.should.be.a('object')
                    // res.body.data.should.have.property('isActive').eql(true);
                   
                })
               // setTimeout(done, 5000);
        })//.timeout(5000)
})