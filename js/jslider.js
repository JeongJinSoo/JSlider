
/* 슬라이더 생성자 */
function JSlider(settings){
  this.total = settings.total;
  this.prev = settings.prev;
  this.current = settings.current;
  this.next = settings.next;
  this.imgPath = settings.imgPath;
  // current pointer on the preview (0,1,2)
  this.currentPreview = settings.current; 
  
  this.btnPrev = settings.btnPrev;
  this.btnNext = settings.btnNext;
  this.display = settings.display; // displayWrapper
  this.preview = settings.preview; // previewWrapper
  this.preview_setting = [];
  
  this.loop = settings.loop;
  this.animate = settings.animate;
}

JSlider.prototype = {
  goPrev : function () {
    if(!this.loop || this.loop === null){
      if(this.current-1 > 0){
      	this.prev = this.prev-1;
      	this.current  = this.current - 1;
            
      	if(this.next !== null){
      		this.next = this.next-1;	
      	}else{
      		this.next = this.total-1;
      	}

      }else if(this.current-1 === 0){
      	this.prev = null;
      	this.current = 0;
      	this.next = 1;
      } 
    }else{ // loop true

      // 음수로 변경 (왼쪽으로 이동중)
      if(this.prev <= 0){
        this.prev = this.total-1;
      }else{
        this.prev--;  
      }
      
      if(this.next <= 0){
        this.next = this.total-1;
      }else{
        this.next--;
      }
      
      if(this.current <= 0){
        this.current = this.total-1;
      }else{
        this.current--;  
      }
    }
  },
  
  goNext : function () {
    if(!this.loop || this.loop === null){
      if(this.current+1 < this.total-1){
      	this.prev = this.current;
      	this.current = this.next;
      	this.next = this.next+1;
      }else if(this.current+1 === this.total-1){
      	this.prev = this.current;
      	this.current = this.next;
      	this.next = null;
      }  
    }else{ // loop true
        // 양수로 변경 (오른쪽으로 이동중)
        
        if(this.prev >= this.total-1){
          this.prev = 0;
        }else{
          this.prev++;  
        }
        
        if(this.next >= this.total-1){
          this.next = 0;
        }else{
          this.next++;
        }
        
        if(this.current >= this.total-1){
          this.current = 0;
        }else{
          this.current++;  
        }
    }
  },
  
  // 썸네일중 하나를 선택했을 때
  selectThumbnail : function () {
    
  },
  
  getStatus : function(){
//         console.log("total : " + this.total);
    console.log("prev : " + this.prev);
    console.log("current : " + this.current);
    console.log("next : " + this.next);
//         console.log("pointer : " + this.currentPreview);
    console.log("preview : " + this.preview_setting.toString());
  }
};


function showMainDisplay(slider){
    var pos = slider.current + 1;
    slider.display.html('<img src="' + 
      slider.imgPath + pos + '.jpg" alt="' + pos + 
        '" width="352" height="356" class="show_img" />');
}


function displayPreview(slider, direction){
  var str = "", i;
    
    if(!slider.animate){
      if(slider.preview_setting.length <= 0 || slider.preview_setting === null){
        slider.preview_setting = [
          slider.current+1 >= slider.total+1 ? Math.abs(slider.current+1-slider.total) : slider.current+1, 
          slider.current+2 >= slider.total+1 ? Math.abs(slider.current+2-slider.total) : slider.current+2, 
          slider.current+3 >= slider.total+1 ? Math.abs(slider.current+3-slider.total) : slider.current+3
        ];
      }else{
        if(direction === 'next'){ // 다음으로 이동할 경우
          var tmp = slider.preview_setting[1];
          slider.preview_setting = 
          [
            tmp >= slider.total+1 ? Math.abs(tmp-slider.total) : tmp, 
            tmp+1 >= slider.total+1 ? Math.abs(tmp+1-slider.total) : tmp+1,
            tmp+2 >= slider.total+1 ? Math.abs(tmp+2-slider.total) : tmp+2
          ];

        }else if(direction === 'prev'){ // 이전으로 이동할 경우
          var tmp2 = slider.preview_setting[1];
          slider.preview_setting = 
          [
            tmp2-2 < 1 ? Math.abs(slider.total+tmp2-2) : tmp2-2,
            tmp2-1 < 1 ? Math.abs(slider.total+tmp2-1) : tmp2-1,
            tmp2 < 1 ? Math.abs(slider.total+1-tmp2) : tmp2
          ];
        
        }else{
          throw new Error('Where am I??');
        }
      }
      
      // 루프를 돌 때 위치로 같이 세팅한다.
      for(i=0,len = slider.preview_setting.length; i < len ;i++){
      str += '<a href="#none" class="img"><img src="' +
          slider.imgPath + i + '.jpg" alt="' + slider.preview_setting[i] + '" width="57" height="60" /></a>';
    }
      
      slider.preview.addClass('invisible');
      slider.preview.html(str);
      
      // 여기서 위치를 조정한다. 결국 여기서 또 루프를 돌게 된다. 이를 피할 수 있는 방법이 있을까?
      for(var el=0;el<slider.preview_setting.length;el++){
        $('.img').eq(el).css({
          'left' : 73*el + 'px'
        });
      }
      
      slider.preview.removeClass('invisible');
    }else if(slider.animate){ // in case supporting animation
      /* 
        나열할 썸네일을 그린다. 
        total개수를 모두 그릴 것인데 어디서부터 그리는가가 중요하다. 
        가령, 첫 시작 위치가 5라면 5,6,7이 가장 첫 위치가 될 것이다.
        혹은 1번부터 순차적으로 그린 후에 위치를 조정할 수 있을 것이다.
        어떤 것이 덜 비용을 들이면서 구현할 수 있는지 확인을 해보자.
        
        이곳에서 움직임을 제어할 수 있도록 설정이 가능한가?
        
      */
      
      // 루프를 돌 때 위치를 함께 세팅해준다.
      for(i=1,len = slider.total; i <= len ;i++){
      str += '<a href="#none" class="img"><img src="' +
          slider.imgPath + i + '.jpg" alt="' + i + '" width="57" height="60" /></a>';
    }
      
      // 순서대로 입력한 후에 위치를 조정한다.
      // DOM에 삽입하기 전에 위치를 조정한다.
      // preview-thumbnail의 넓이를 세팅한다.
      // 안에 있는 a태그를 세팅한다.
      // 위치를 세팅하기 위해서는 각각의 이미지 썸네일을 탐색하려면 돔에 집어 넣어야 한다.
      // 이 때문에 미리 넣은 다음 보여줄 수 있도록 해야 한다.
      // invisible을 넣어주었다가 모든 처리가 완료되면 invisible을 제거한다.
      
      slider.preview.addClass('invisible');
      slider.preview.html(str);
      
      // 넣은 후에 탐색할 것.
      for(var ele=0;ele<slider.total;ele++){
        $('.img').eq(ele).css({
          'left' : 72*ele + 'px'
        });
      }
      
      // 첫 위치를 조정할 것. direction을 받아서 해당 방향으로 한칸씩 이동한다.
      // 맨 끝에 도달했을 경우 반대쪽에서 하나를 떼어서 옮기고 이동시킨다. 항상 끝쪽에 더이상 갈 수 없을 경우를 판단하여 DOM을 떼어다가 이동시켜야 한다. 만약 그럴필요가 없을 경우 해당 액션은 생략해야 한다.
      
      
      
      
      // 모든 처리가 완료될 경우 보여줄 것.
      slider.preview.removeClass('invisible');
    }

  
}

  
  // @ current와 함께 위치를 찍어주자.??
function setPointerOnPreview(slider, direction){
    slider.preview.find("img").removeClass("selected");

    if(direction === null){ // 초기화
      slider.preview.find("img")
        .eq(slider.currentPreview).addClass("selected");
      return;
    }
    
    if(direction === "next" && slider.currentPreview === 2){
      slider.preview.find("img").eq(2).addClass("selected");
      slider.currentPreview = 2;
      displayPreview(slider, "next");
    }else if(direction === "prev" && slider.currentPreview === 0){
      slider.preview.find("img").eq(0).addClass("selected");
      slider.currentPreview = 0;
      displayPreview(slider, "prev");
    }else{
      if(direction === "prev"){
        slider.currentPreview--;
      }else{
        slider.currentPreview++;
      }
    }
    
    slider.preview.find("img")
      .eq(slider.currentPreview).addClass("selected");
}

  
function controlButton(slider){
    if(!slider.loop || slider.loop === null){
      if(slider.next !== null){
		slider.btnNext.removeClass("invisible");
	}else{
		slider.btnNext.addClass("invisible");
	}

	if(slider.prev !== null){
		slider.btnPrev.removeClass("invisible");
	}else{
		slider.btnPrev.addClass("invisible");
	}
    }else{ // loop true
      
    }
}

/*
  데이터를 기반으로 뷰가 수정이 될 수 있도록 할 것.
  데이터의 변경이 없으면 뷰의 변경도 없다.

*/

function initialize(slider){ // 이 부분을 prototype에 등록할 것.
    if(slider.total >= 3){
      
      displayPreview(slider, "next");
      showMainDisplay(slider);
      setPointerOnPreview(slider, null);
      controlButton(slider);

    }else{
      throw new Error("총 이미지는 3개 이상 등록이 되어야 한다.");
    }
}


/* slider */
var slider = new JSlider({
	total : 8,
	current : 0,
	next : 1,
	prev : null,
	imgPath : "../assets/images/slider/",
      btnPrev : $(".prev-btn"),
      btnNext : $(".next-btn"),
      display : $(".simpleSlider .item"),
      preview : $(".preview-thumbnail"),
      loop : true,
      animate : true // true일 경우 animate효과를 통하여 이동될 수 있도록 변경한다.
});


// initiate this slider
initialize(slider); // initialize를 할 경우 뷰가 나타날 수 있도록 변경할 것.

// Binding event with button
slider.btnPrev.bind("click", function () {
    var target = slider;
    target.goPrev();

    showMainDisplay(target);
    setPointerOnPreview(target, "prev");
    controlButton(target);
    return false;
});

slider.btnNext.bind("click", function () {
    var target = slider;
    target.goNext();
    
    showMainDisplay(target);
    setPointerOnPreview(target, "next");
    controlButton(target);
    return false;
});



  /* slider2 */
  // 현재 위치만 데이터를 받고 나머지는 지울 수 있도록 변경한다.
//     var slider2 = new JSlider({
// 		total : 10,
// 		current : 0,
// 		next : 1,
// 		prev : 9,
// 		imgPath : "../assets/images/slider/",
//         btnPrev : $(".prev-btn2"),
//         btnNext : $(".next-btn2"),
//         display : $(".simpleSlider2 .item"),
//         preview : $(".preview-thumbnail2"),
//         loop : true, // 루프 허용
//         animate : true // preview 애니메이션
// 	});


// 	// initiate this slider
// 	initialize(slider2);

//     // Binding event with button
// 	slider2.btnPrev.bind("click", function () {
//       var target = slider2;
//       target.goPrev();

//       showMainDisplay(target);
//       setPointerOnPreview(target, "prev");
//       controlButton(target);
    
//       target.getStatus();
    
//       return false;
// 	});

// 	slider2.btnNext.bind("click", function () {
//       var target = slider2;
//       target.goNext();
    
//       showMainDisplay(target);
//       setPointerOnPreview(target, "next");
//       controlButton(target);
    
//       target.getStatus();
    
//       return false;
// 	});


