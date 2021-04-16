<template>
  <div id="app">
    <header id="menu">
      <ul>
        <li>
          <a href="#about">ABOUT</a>
        </li>
        <li>
          <a href="#document">DOCUMENT</a>
        </li>
        <li>
          <a href="#download">DOWNLOAD</a>
        </li>
        <li>
          <a href="#contact">CONTACT</a>
        </li>
      </ul>
    </header>
    <main>
      <section id="about">
        <h2>CC-Map</h2>
        <p class="text"></p>
        <p>
          CC-Map is Free and Open Source Software licensed under the
          <a
            href="http://www.gnu.org/licenses/old-licenses/gpl-2.0.html"
          >GPL</a>.
        </p>
        <div class="insider">
          <a
            href="http://101.200.169.185:3000/api/download/cc-map1.2-windows-200501.exe"
            class="button"
          >Windows</a>
          <br />
          <a
            href="http://101.200.169.185:3000/api/download/cc-map1.2-android-200501.apk"
            class="button"
          >Android</a>
          <a @click="toEdit()" class="button">Online</a>
        </div>
      </section>

      <section id="document">
        <h2>Document</h2>
        <h4>The document about this software.</h4>
        <h3>README</h3>
        <a href="#">Software Requirements Specification</a>
        <h3>Manual</h3>
        <a href="#">User Manual Online</a>
      </section>

      <section id="status">
        <h2>Development Status</h2>
        <h4>The development status about this software.</h4>
        <p>This software is a mind map management software.</p>
      </section>

      <section id="download">
        <h2>Download</h2>
        <h4>To get CC-Map.</h4>
        <h3>Latest Version</h3>
        <p>The latest version--Modified: 2020/05/01</p>
        <a
          href="http://101.200.169.185:3000/api/download/cc-map1.2-windows-200501.exe"
          download="cc-map1.2-200501.exe"
        >Download to Windows</a>
        <br />
        <a
          href="http://101.200.169.185:3000/api/download/cc-map1.2-android-200501.apk"
          download="cc-map1.2-200501.apk"
        >Download to Android</a>
      </section>

      <section id="contact">
        <h2>Contact with us</h2>
        <h3>E-Mail: 374246174@qq.com</h3>
      </section>
    </main>
    <footer>
      <div class="copyright">Copyright &copy; 2020.CMY All rights reserved.</div>
    </footer>
  </div>
</template>

<script>
export default {
  mounted() {
    window.onscroll = function() {
      var topScroll = get_scrollTop_of_body(); //滚动的距离,距离顶部的距离
      var menu = document.getElementById("menu"); //获取到导航栏id
      if (topScroll > 10) {
        //当滚动距离大于250px时执行下面的东西
        menu.style.position = "fixed";
        menu.style.left = "50%";
        menu.style.transform = "translate(-50%)";
        menu.style.zIndex = "9999";
      } else {
        //当滚动距离小于250的时候执行下面的内容，也就是让导航栏恢复原状
        menu.style.position = "static";
        menu.style.transform = "translate(0)";
      }
    };
    /*解决浏览器兼容问题*/
    function get_scrollTop_of_body() {
      var scrollTop;
      if (typeof window.pageYOffset != "undefined") {
        //pageYOffset指的是滚动条顶部到网页顶部的距离
        scrollTop = window.pageYOffset;
      } else if (
        typeof document.compatMode != "undefined" &&
        document.compatMode != "BackCompat"
      ) {
        scrollTop = document.documentElement.scrollTop;
      } else if (typeof document.body != "undefined") {
        scrollTop = document.body.scrollTop;
      }
      return scrollTop;
    }
  },
  methods: {
    toEdit() {
      this.$router.push("/home");
    }
  }
};
</script>

<style lang="less" scoped>
html,
body,
#app {
  height: 100vh;
  background: #fff;
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  text-align: center;
  font-size: 14px;
  font-family: Arial;
  font-weight: normal;
  list-style: none;

  header {
    position: relative;
    width: 100vh;
    height: 60px;
    top: 0;
    margin: 0 auto;
    background: #fff;
    z-index: 99999;
    box-sizing: border-box;
    box-shadow: 0 0 5px #000;
    -webkit-box-shadow: 0 0 5px #000;

    ul {
      position: absolute;
      right: 5vh;
      li {
        float: left;
        a {
          float: left;
          text-decoration: none;
          color: #333;
          padding: 10px 25px;
          text-transform: uppercase;
          transition: 0.5s;
          -webkit-transition: 0.5s;
        }
        a:hover {
          background: #187cc2;
          color: #fff;
          border-radius: 5px;
        }
      }
    }
  }

  main {
    position: relative;
    top: 20px;
    margin: 0 auto;
    width: 100vh;

    section {
      margin: 40px 0;
      padding: 30px;

      h2 {
        font-size: 30px;
        color: #333;
        margin: 0 0 30px 0;
        padding: 0 0 0 0;
      }
      h3 {
        font-size: 18px;
        color: #4b4b4b;
        margin: 20px 0 0 0;
      }
      h4 {
        font-size: 11px;
        color: #909090;
        text-transform: uppercase;
      }
      p {
        color: #777779;
        line-height: 24px;
        margin: 0 0 30px 0;
      }

      a {
        text-decoration: none;
        color: #333;
        text-transform: uppercase;
        transition: 0.5s;
        -webkit-transition: 0.5s;
      }
    }

    #about {
      background: #9accff;
      border-radius: 10px;
      margin-top: 30px;
      padding: 10px;

      h2 {
        color: #ffffff;
        .text {
          color: #ffffff;
        }
      }

      .insider {
        display: flex;
        justify-content: space-between;
        margin: 0 auto;
        width: auto;
        position: relative;

        .button {
          width: 130px;
          height: 41px;
          margin: 0 30px;
          border: 1px solid #11598b;
          color: #fff;
          text-transform: uppercase;
          line-height: 41px;
          border-radius: 5px;
          -webkit-border-radius: 5px;
          transition: 0.5s;
          -webkit-transition: 0.5s;
          background: #11598b;
          text-decoration: none;
        }

        .button:hover {
          text-decoration: none;
          background: none;
          border: 1px solid #fff;
          color: #fff;
        }
      }
    }

    #status,
    #document,
    #download {
      background: #f8f8fa;
    }

    #download {
      p {
        margin: 0;
      }
    }

    #contact {
      border: solid #e7e7e7;
      border-width: 1px 0;
    }
  }

  footer {
    position: relative;
    width: 100vh;
    margin: 20px auto;
    .copyright {
      color: #a5a5a5;
    }
  }
}
</style>
