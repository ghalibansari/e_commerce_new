 
// import chai from 'chai'
// import chaiHttp from 'chai-http'
// import app from '../../app'
// let should = chai.should();
// chai.use(chaiHttp);
// import mongoose from 'mongoose'

// //login token
// let authKey = '< paste Auth token >'
// // describe('Array...[Demo]', function() {
// //     it('should start empty', function() {
// //       var arr = [];
// //       arr.length.should.be.eql(0)
// //     });
// //   });

// // });
// //Todo change DB name
// describe('test Mongo Db', function () {
//     //@ts-ignore //Todo remove this line...
//     mongoose.Promise = global.Promise;
//     mongoose.connect('mongodb+srv://infinity2020:infinity2020@infinity.7kj2a.gcp.mongodb.net/infinity_dev_qc?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,});
//     mongoose.connection
//         .once('open', () => console.log('<<<<<<<<<<<   ========[ Mongo DB Connected ]======== >>>>>>>>>>>>>'))
//         .on('error', (error) => {
//             console.warn('Mongo Connection Error : ', error);
//         });
// });

// describe('USER module Apis', () => {
    
//     it("GET /api/v1/user/", (done) => {
//         chai.request(app)
//             .get("/api/v1/user/")
//             .set('authorization', authKey)
//             .end((err, res) => {
//                 //   console.log("***RES",res.body);
//                 console.log("Message:",res.body.message);
//                 res.should.have.status(200)
//                 res.body.should.be.a('object');
//                 res.body.status.should.equal(true)
//                 res.body.data.should.be.a('array')
//                 res.body.data.length.should.not.equal(0)
//                 done()
//             })
//               // done();
//             })
// //})

// //describe('Reading user details by _id', () => {
//     it("GET /api/v1/user/get-by-id", (done) => {
//         let _id = '5f2945c9194d492da0ff8ed6'
//         chai.request(app)
//             .get('/api/v1/user/get-by-id?_id='+_id)
//             .set('authorization', authKey)
//             .end((err, res) => {
//                  //console.log("***  RES =====>",res.body);
//                  console.log("Message:",res.body.message);
//                 res.should.have.status(200)
//                 res.body.should.be.a('object');
//                 res.body.status.should.equal(true)
//                 res.body.data.should.be.a('object')
//                 res.body.data.should.have.property('isActive').eql(true);
//                // console.log("byId",res.body.data);
//                 done()
                
//             })
//             //done();
//             })
//         })
// describe('Reading user details by index', () => {
//     it("GET /api/v1/user/index", (done) => {
//                 chai.request(app)
//                     .get('/api/v1/user/index')
//                     .set('authorization', authKey)
//                     .end((err, res) => {
//                          //console.log("***  RES =====>",res.body);
//                          console.log("Message:",res.body.message);
//                         res.should.have.status(200)
//                         res.body.should.be.a('object');
//                         res.body.status.should.equal(true)
//                         res.body.data.should.be.a('array')
//                         res.body.should.have.property('message').eql('Fetch Successful');
//                        // console.log("byId",res.body.data);
                       
//                         done()
                        
//                     })
//                     //done();
//                     })
// })
// describe('Reading user details by filterCriteria', () => {
//     it("GET /api/v1/user/filterCriteria", (done) => {
//                         chai.request(app)
//                             .get('/api/v1/user/filterCriteria')
//                             .set('authorization', authKey)
//                             .end((err, res) => {
//                                  //console.log("***  RES =====>",res.body);
//                                  console.log("Message:",res.body.message);
//                                 res.should.have.status(200)
//                                 res.body.should.be.a('object');
//                                 res.body.status.should.equal(true)
//                                 res.body.data.should.be.a('object')
//                                 res.body.should.have.property('message').eql('Fetch Successful');
//                                // console.log("byId",res.body.data);
//                                 done()
                                
//                             })
//                            //done();
//                             })                
//                         })

// // describe('creating user by details..', () => {
// //     it("post /api/v1/user/", (done) => {
// //         let body ={
// //             "firstName": "super",
// //             "lastName": "admin",
// //             "email": "superadmin@spacecode.com",
// //             "altEmail": "superduperadmin@spacecode.com",
// //             "password": "Amin@123",
// //             "phone": "987654321654",
// //             "companyId": "5f3e2a9335ebe9003c84b91d",
// //             "roleId": "5f44c60e80d86f1e6d40f08c",
// //             "address": {
// //                 "address1":"testingMan",
// //                 "address2":"rtesing",
// //                 "city":"MUMBAI",
// //                 "state":"MAHARASTRA",
// //                 "country":"INDIA",
// //                 "zipCode": 400050,
// //                 "attributes": [{"key": "keyExample", "value": "valueExample"}]
// //             },	
// //             "attributes": [{"key": "nickname", "value": "tester"}]
// //         }
// //         chai.request(app)
// //             .post('/api/v1/user/')
// //             .set('authorization', authKey)
// //             .send(body)
// //             .end((err, res) => {
// //                 //  console.log("***  RES =====>",res.body);
// //                 res.should.have.status(200)
// //                 res.body.should.be.a('object');
// //                 res.body.status.should.equal(true)
// //                 res.body.should.have.property('message').eql('Create Successful');
// //                 // res.body.data.should.be.a('object')
// //                 // res.body.data.should.have.property('isActive').eql(true);
// //                 done();
// //             })
// //                // done();
// //             })
// // })

// // describe('Delete user by _id', () => {
// //     it("DELETE /api/v1/user/", (done) => {
// //         let _id = '5ed221eca3c1ca449488cd5f'
// //         chai.request(app)
// //             .delete('/api/v1/user?_id='+_id)
// //             .set('authorization', authKey)
// //             .end((err, res) => {
// //                 // console.log("***  RES =====>",res.body);
// //                 res.should.have.status(200)
// //                 res.body.should.be.a('object');
// //                 res.body.status.should.equal(true)
// //                 // res.body.data.should.be.a('object')
// //                 res.body.should.have.property('message').eql('Delete Successful');
// //                 done();
// //             })
// //             // .catch(err => done(err));
// //             })
// // })

// // describe('Update user by _id', () => {
// //     it("PUT /api/v1/user/", (done) => {
// //         let body ={
// //             "_id":"5f44d06c72d516401902b591",
// //             "firstName": "super",
// //             "lastName": "admin",
// //             "email": "itssuperadmin@spacecode.com",
// //             "altEmail": "superduperadmin@spacecode.com",
// //             "password": "Amin@123",
// //             "phone": "987654321654",
// //             "companyId": "5f3e2a9335ebe9003c84b91d",
// //             "roleId": "5f44c60e80d86f1e6d40f08c",
// //             "address": {
// //                 "address1":"testing",
// //                 "address2":"rtesing",
// //                 "city":"MUMBAI",
// //                 "state":"MAHARASTRA",
// //                 "country":"INDIA",
// //                 "zipCode": 400050,
// //                 "attributes": [{"key": "keyExample", "value": "valueExample"}]
// //             },	
// //             "attributes": [{"key": "nickname", "value": "tester"}]
// //         }
// //         chai.request(app)
// //             .put('/api/v1/user')
// //             .send(body)
// //             .set('authorization', authKey)
// //             .end((err, res) => {
// //                 // console.log("***  RES =====>",res.body);
// //                 res.should.have.status(200)
// //                 res.body.should.be.a('object');
// //                 res.body.status.should.equal(true)
// //                 // res.body.data.should.be.a('object')
// //                 res.body.should.have.property('message').eql('Update Successful');
// //                 done();
// //             })
// //             // .catch(err => done(err));
// //             })
// // })