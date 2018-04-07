//index.js
Page({
  data: {
    movies: [],
    page: 0,
    pageSize: 6,
    animationData: null,
    loading: false,
    noMovie: false,
  },
  //事件处理函数
  onLoad: function () {
    this.getMovies()
  },
  toMovieInfo: function () {
    wx.navigateTo({
      url: '../movieInfo/movieInfo'
    })
  },
  getMovies: function () {
    this.setData({
      loading: true
    })
    const {page, pageSize} = this.data;
    wx.request({
      url: `http://192.168.0.117:5000/v2/movie/top250?count=${pageSize}&start=${page*pageSize}`,
      success:(res)=> {
        const data = res.data.subjects;
        if(data.length === 0) {
          this.setData({loading: false})
          this.noMovieTip();
          return false;
        }
        const movies = this.data.movies;
        var movie_item = data.splice(0,2);
        while (movie_item.length !== 0) {
          movies.push(movie_item);
          movie_item = data.splice(0, 2);
        }
        this.setData({
          movies:movies,
          loading: false,
        });
      },
      fail: function (data) {
        console.log(data)
      }
    })
  },
  scrolltolower: function () {
    if (this.data.loading) {
      return false;
    }
    this.setData({
      page: this.data.page+1
    });
    this.getMovies();
  },
  noMovieTip: function () {
    if(this.data.noMovie) return false;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })
    animation.opacity(1).step();
    this.setData({
      noMovie: true,
      animationData: animation.export()
    })
    setTimeout(()=>{
      animation.opacity(0).step();
      this.setData({
        animationData: animation.export(),
        noMovie: false
      })
    },2000)
  }
})
