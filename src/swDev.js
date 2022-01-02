// export default  function swDev(){
//     let swUrl = `${process.env.PUBLIC_URL}/sw.js`;
//     navigator.serviceWorker.register(swUrl)
// }
export default  function swDev(){
    let swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;
    navigator.serviceWorker.register(swUrl)
}
