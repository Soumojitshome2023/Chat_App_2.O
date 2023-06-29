
// ===========================================On Load===========================================

let sndr_name;
let rcvr_name;

window.addEventListener("load", () => {

    save("sender_name");
    save("receiver_name");

    sndr_name = localStorage.getItem("sender_name");
    rcvr_name = localStorage.getItem("receiver_name");


    document.getElementById("sender_ph_on_head").innerHTML = localStorage.getItem("sender_name");
    document.getElementById("receiver_name_on_head").innerHTML = localStorage.getItem("receiver_name");

    load();

    setTimeout(() => {

        setInterval(() => {
            msg_update();
        }, 3000);

    }, 3000);

});

// ===========================================On Change===========================================

document.querySelectorAll("input").forEach((ele, ind) => {
    document.querySelectorAll("input")[ind].addEventListener("change", () => {

        sndr_name = document.getElementById("sender_name").value;
        rcvr_name = document.getElementById("receiver_name").value;

        document.getElementById("sender_ph_on_head").innerHTML = document.getElementById("sender_name").value;
        document.getElementById("receiver_name_on_head").innerHTML = document.getElementById("receiver_name").value;

        load();
        // location.reload();

    })

})






// =======================================Button Disabled=======================================

setInterval(() => {

    btn_disable();

}, 1000);


function btn_disable() {

    if (document.getElementById("sender_name").value.trim() != "" && document.getElementById("receiver_name").value.trim() != "" && document.getElementById("chat_entry").value.trim() != "") {

        if ((document.getElementById("sender_name").value.trim() >= 'A' && document.getElementById("sender_name").value.trim() <= 'Z') || (document.getElementById("sender_name").value.trim() >= 'a' && document.getElementById("sender_name").value.trim() <= 'z')) {


            document.getElementById("submit-btn").disabled = false;
        }
        else {
            document.getElementById("submit-btn").disabled = true;

        }

    }
    else {
        document.getElementById("submit-btn").disabled = true;

    }

}


// =========================================Data Upload=========================================



const scriptURL = 'https://script.google.com/macros/s/AKfycbxJPNzFZev7dInBonoZJFgvsqJ_xBhNwp6d_D1WOVcdtutdicofQsIKFFnMzDdNb5Lc/exec'


const form = document.forms['submit-to-google-sheet']

form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => console.log('Success!', response))


        .catch(error => console.error('Error!', error.message))

})


function waiting_message() {

    document.getElementById("submit-btn").style.display = "none";
    document.getElementById("wait_mess").style.display = "block";

    setTimeout(() => {

        chat_bottom();

        document.getElementById("chat_entry").value = "";
        document.getElementById("wait_mess").style.display = "none";
        document.getElementById("submit-btn").style.display = "block";



    }, 4000);

}


// ==========================================Data Load==========================================


let old_len = 0;

function load() {

    document.getElementById("inside_chat_area").innerHTML = "";
    waiting_message();

    fetch(scriptURL)
        .then(res => res.text())
        .then(rep => {
            let data = JSON.parse(rep);


            let length = data.length;


            // console.log("load call")
            // console.log(data[1][3]);

            let i;
            for (i = 1; i < length; i++) {

                if (data[i][1] == sndr_name && data[i][2] == rcvr_name) {

                    let tmp1 = `<div class="send_message">
                    <p>${"You : " + data[i][3]}</p>
                    </div>`;
                    document.getElementById("inside_chat_area").innerHTML += tmp1;

                }
                else if (data[i][1] == rcvr_name && data[i][2] == sndr_name) {

                    let tmp2 = `
                    <div class="received_message">
                    <p>${data[i][1] + ": " + data[i][3]}</p>
                    </div>`;
                    document.getElementById("inside_chat_area").innerHTML += tmp2;

                }

            }
            old_len = i;

            chat_bottom();

            setTimeout(() => {

                cntct_update();
            }, 1000);
            // console.log("Load Chats : " + old_len);

        })
}

// ========================================Message Update========================================

function msg_update() {

    fetch(scriptURL)
        .then(res => res.text())
        .then(rep => {
            let data2 = JSON.parse(rep);


            let length2 = data2.length;

            if (length2 > old_len) {

                // console.log("Chat add or update, msg update fun run");

                let k;
                for (k = old_len; k < length2; k++) {
                    if (data2[k][1] == sndr_name && data2[k][2] == rcvr_name) {

                        let tmp3 = `<div class="send_message">
                        <p>${"You : " + data2[k][3]}</p>
                        </div>`;
                        document.getElementById("inside_chat_area").innerHTML += tmp3;

                    }
                    else if (data2[k][1] == rcvr_name && data2[k][2] == sndr_name) {

                        let tmp4 = `
                        <div class="received_message">
                        <p>${data2[k][1] + ": " + data2[k][3]}</p>
                        </div>`;
                        document.getElementById("inside_chat_area").innerHTML += tmp4;

                    }
                }

                old_len = k;

                chat_bottom();

                // console.log("After adding, total chats no : " + old_len);
            }


        })

}




// ======================================Chat Scroll to Bottom======================================

function chat_bottom() {
    var scrollbarElement = document.getElementById('chat_area');
    scrollbarElement.scrollTop = scrollbarElement.scrollHeight;
}



// =====================================Form Auto Save=========================================

function save(idv) {

    if (localStorage.getItem(idv) != null) {

        let b = document.getElementById(idv);
        b.value = localStorage.getItem(idv);
    }



    document.getElementById(idv).addEventListener("change", () => {



        if (document.getElementById(idv).value != localStorage.getItem(idv)) {

            console.log("local storage data update");

            let a = document.getElementById(idv).value;
            localStorage.setItem(idv, a);
        }


    })



}



// =======================================Hamberger===============================================


function contact_toggle() {


    if (document.getElementById("contact_box").style.display == "none") {


        document.getElementById("contact_box").style.display = "block";

        document.getElementsByClassName("hamline")[0].style.display = "none";


        document.getElementsByClassName("hamline")[1].style.transform = "rotate(55deg)";
        document.getElementsByClassName("hamline")[1].style.margin = 0;
        document.getElementsByClassName("hamline")[2].style.margin = 0;
        document.getElementsByClassName("hamline")[2].style.transform = "rotate(-55deg)";

    }
    else {
        document.getElementById("contact_box").style.display = "none";


        document.getElementsByClassName("hamline")[0].style.display = "block";


        document.getElementsByClassName("hamline")[1].style.transform = "";
        document.getElementsByClassName("hamline")[1].style.margin = "";
        document.getElementsByClassName("hamline")[2].style.margin = "";
        document.getElementsByClassName("hamline")[2].style.transform = "";


    }



}

function contact_close() {
    document.getElementById("contact_box").style.display = "none";

    document.getElementsByClassName("hamline")[0].style.display = "block";


    document.getElementsByClassName("hamline")[1].style.transform = "";
    document.getElementsByClassName("hamline")[1].style.margin = "";
    document.getElementsByClassName("hamline")[2].style.margin = "";
    document.getElementsByClassName("hamline")[2].style.transform = "";
}


// ==========================================User Wish==========================================

function user_wish(code) {

    document.getElementById("receiver_name").value = code;
    document.getElementById("receiver_name_on_head").innerHTML = code;
    localStorage.setItem("receiver_name", code);


    // location.reload();
    rcvr_name = code;


    load();
    contact_close();

}




// ==================================Contact Update=====================================================


function cntct_update() {

    document.getElementById("contact_box").innerHTML = "";

    fetch(scriptURL)
        .then(res => res.text())
        .then(rep => {
            let data3 = JSON.parse(rep);


            let length3 = data3.length;

            let s = 1;
            for (let k = 1; k < length3; k++) {
                let flag = 1;


                for (let m = 1; m < k; m++) {

                    if (k == m) {
                        flag = 1;

                    }
                    else if ((data3[k][1] == data3[m][1]) && (data3[k][2] == data3[m][2])) {
                        flag = 0;

                        break;

                    }

                }

                if (flag == 1) {
                    if (data3[k][1] == sndr_name) {

                        let tmp4 = `<div class="contact"><p>${s + ") " + data3[k][2]}</p><button class="contact_btn" onclick="user_wish('${data3[k][2]}')">Send Message</button></div>`;
                        s++;
                        document.getElementById("contact_box").innerHTML += tmp4;

                    }

                }

            }

        })
}




// ================================================================================================

