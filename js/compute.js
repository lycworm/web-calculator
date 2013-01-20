jQuery(function($){

	/*运算符之间的优先级*/
	function OperatorOrder(left, right, order) {
		this.left = left;
		this.right = right;
		this.order = order;
	}
	
	/*运算符的集合*/
	function OperatorSet() {
		this.operator = ['+', '-', '*', '/', '(', ')', '#'];
	}
	
	/*操作数和运算符之间的运算*/
	function Operate(o, left, right) {
		this.o = o;
		this.left = left;
		this.right = right;
	}
	
	/*计算表达式的值*/
	function Compute() {
		/*表达式*/
		this.expression = "";
		/*运算符栈*/
		this.OPTR = ['#'];
		/*操作数栈*/
		this.OPND = [];
		/*运算符集合*/
		this.operatorSet = new OperatorSet();
		/*运算符的优先级*/
		this.optrTable = [
			new OperatorOrder('+', '+', '>'), new OperatorOrder('+', '-', '>'), new OperatorOrder('+', '*', '<'), 
			new OperatorOrder('+', '/', '<'), new OperatorOrder('+', '(', '<'), new OperatorOrder('+', ')', '>'),
			new OperatorOrder('+', '#', '>'), new OperatorOrder('-', '+', '>'), new OperatorOrder('-', '-', '>'),
			new OperatorOrder('-', '*', '<'), new OperatorOrder('-', '/', '<'), new OperatorOrder('-', '(', '<'),
			new OperatorOrder('-', ')', '>'), new OperatorOrder('-', '#', '>'), new OperatorOrder('*', '+', '>'),
			new OperatorOrder('*', '-', '>'), new OperatorOrder('*', '*', '>'), new OperatorOrder('*', '/', '>'),
			new OperatorOrder('*', '(', '<'), new OperatorOrder('*', ')', '>'), new OperatorOrder('*', '#', '>'),
			new OperatorOrder('/', '+', '>'), new OperatorOrder('/', '-', '>'), new OperatorOrder('/', '*', '>'),
			new OperatorOrder('/', '/', '>'), new OperatorOrder('/', '(', '<'), new OperatorOrder('/', ')', '>'),
			new OperatorOrder('/', '#', '>'), new OperatorOrder('(', '+', '<'), new OperatorOrder('(', '-', '<'),
			new OperatorOrder('(', '*', '<'), new OperatorOrder('(', '/', '<'), new OperatorOrder('(', '(', '<'),
			new OperatorOrder('(', ')', '='), new OperatorOrder('(', '#', 'N'), new OperatorOrder(')', '+', '>'),
			new OperatorOrder(')', '-', '>'), new OperatorOrder(')', '*', '>'), new OperatorOrder(')', '/', '>'),
			new OperatorOrder(')', '(', 'N'), new OperatorOrder(')', ')', '>'), new OperatorOrder(')', '#', '>'),
			new OperatorOrder('#', '+', '<'), new OperatorOrder('#', '-', '<'), new OperatorOrder('#', '*', '<'),
			new OperatorOrder('#', '/', '<'), new OperatorOrder('#', '(', '<'), new OperatorOrder('#', ')', 'N'),
			new OperatorOrder('#', '#', '=')
		];
	}
	
	Operate.prototype = {
		constructor:Operate,
		/*获取运算结果*/
		computeResult:function() {
			if (this.left.indexOf('.') == -1 && this.right.indexOf('.') == -1) {
				return this.intOperation();
			} else {
				return this.floatOperation();
			}
		},
		
		/*整数之间的运算*/
		intOperation:function() {
			var t1 = parseInt(this.left);
			var t2 = parseInt(this.right);
			var res = 0;
			
			switch(this.o) {
				case '+':
					res = t1 + t2;
					break;
				case '-':
					res = t1 - t2;
					break;
				case '*':
					res = t1 * t2;
					break;
				case '/':
					res = t1 / t2;
					break; 
			}
			return res;
		},
		
		/*浮点数之间的运算*/
		floatOperation:function() {
			var res;
			
			if (this.left.indexOf('.') == -1) {
				this.left = this.left + '.';
			} 
			if (this.right.indexOf('.') == -1) {
				this.right = this.right + '.';
			}
			
			switch(this.o) {
				case '+':
					res = this.floatAdd();
					break;
				case '-':
					res = this.floatSub();
					break;
				case '*':
					res = this.floatMul();
					break;
				case '/':
					res = this.floatDiv();
					break;
			}														
			
			return res;
		},
		
		/*浮点数加法*/
		floatAdd:function() {
			var r1, r2, m;
			var t1 = parseFloat(this.left);
			var t2 = parseFloat(this.right);
			try {
				r1 = this.left.split('.')[1].length;
			} catch (e) {}
			
			try {
				r2 = this.right.split('.')[1].length;
			} catch (e){}
			
			m = Math.pow(10, Math.max(r1, r2));
			
			return (t1 * m + t2 * m) / m; 
		},
		
		/*浮点数减法*/
		floatSub:function() {
			var r1, r2, m, n;
			var t1 = parseFloat(this.left);
			var t2 = parseFloat(this.right);
			
			try {
				r1 = this.left.split('.')[1].length;
			} catch (e) {
				r1 = 0;
			}
			
			try {
				r2 = this.right.split('.')[1].length;
			} catch (e) {
				r2 = 0;
			}
			
			m = Math.pow(10, Math.max(r1, r2));
			
			n = r1 >= r2 ? r1 : r2;
			return ((t1 * m - t2 * m) / m).toFixed(n);
		},
		
		/*浮点数乘法*/
		floatMul:function() {
			var m = 0;
			try {
				m += this.left.split('.')[1].length;
			} catch (e) {}
			
			try {
				m += this.right.split('.')[1].length;
			} catch (e) {}
			
			return (Number(this.left.replace('.', '')) * Number(this.right.replace('.', ''))) / Math.pow(10, m);
		},
		
		/*浮点数除法*/
		floatDiv:function() {
			var r1 = 0, r2 = 0;
			var t1, t2;
			
			try {
				r1 = this.left.split('.')[1].length;
			} catch (e){}
			
			try {
				r2 = this.right.split('.')[1].length;
			} catch (e) {}
			
			with(Math) {
				t1 = Number(this.left.replace('.', ''));
				t2 = Number(this.right.replace('.', ''));
				
				return (t1 / t2) * pow(10, r2 - r1);
			}
		}
	}
	
	OperatorSet.prototype = {
		constructor:OperatorSet,
		isOperator:function(o) {
			for (var i = 0; i < this.operator.length; ++i) {
				if (o == this.operator[i]) {
					return true;
				}
			}
			
			return false;
		}
	}
	
	/*计算表达式值的原型属性*/
	Compute.prototype = {
		constructor:Compute,
		/*返回两个操作符的优先级*/
		getOrder:function(left, right) {
			for (var i = 0; i < this.optrTable.length; ++i) {
				if (this.optrTable[i].left == left && this.optrTable[i].right == right) {
					return this.optrTable[i].order;
				}
			}
			return 'N';		//出错啦
		},
		
		getResult:function() {
			var num = '';
			for (var i = 0; i < this.expression.length; ++i) {
				if (this.operatorSet.isOperator(this.expression[i])) {
					//操作数进栈
					if (num != '') {
						this.OPND.push(num);
						num = '';
					}
					
					var condition = false;
					do {
						var o = this.OPTR[this.OPTR.length - 1];
						if (this.getOrder(o, this.expression[i]) == '<') {
							this.OPTR.push(this.expression[i]);
							condition = false;
						} else if (this.getOrder(o, this.expression[i]) == '>') {
							var t1 = this.OPND.pop();
							var t2 = this.OPND.pop();
							
							if (typeof t1 == 'undefined' || typeof t2 == 'undefined') {
								alert("Your Expression has syntax error");
								return;
							}
							
							/*从操作符栈中获取栈定操作符*/
							var o = this.OPTR.pop();
							
							/*创建操作数的运算对象*/
							var operate = new Operate(o, t2, t1);
							var res = operate.computeResult();
							
							/*把计算结果转换成字符串后存储在操作数栈中*/
							this.OPND.push(res.toString());
							
							condition = true;
						} else if (this.getOrder(o, this.expression[i]) == '=') {
							this.OPTR.pop();
							condition = false;
						} else {
							alert("Your Expression has syntax error!");
							return;
						}
					} while (condition == true);
				} else {
					num = num.concat(this.expression[i]);
				}
			}
			
			return this.OPND.pop();
		},
		
		appendToExpression :function(c) {
			this.expression = this.expression.concat(c);
		},
		
		getExpression:function() {
			return this.expression;
		},
		
		clearExpression:function() {
			this.expression = '';
		},
		
		deleteExpression:function() {
			if (this.expression == '') {
				alert("Can't delete");
			} else {
				this.expression = this.expression.substring(0, this.expression.length - 1);
			}
		},
		
		operate:function(o, t1, t2) {
			var res;
			
			if (t1.indexOf('.') == -1 && t2.indexOf('.') == -1) {
				t1 = parseInt(t1);
				t2 = parseInt(t2);
				res = intOperation(o, t1, t2);
			} else if (t1.indexOf('.') != -1 || t2.indexOf('.') != -1) {
				res = floatOperation(o, t1, t2);
			}
			
			return res;
		},
		
		clear:function() {
			this.OPTR = ['#'];
			this.OPND = [];
			this.expression = '';
		}
	}
	
	/*这是一个全局变量，用来保存表达式计算的状态*/
	var compute = new Compute();
	
	$("input.button").click(function(){
		
		if (this.value == '=') {
			compute.appendToExpression('#');
			$('input.result').val(compute.getResult());
			compute.clear();
			return;
		} else if (this.value == 'clear') {
			compute.clearExpression();
		} else if (this.value == 'delete') {
			var display = $('input.result').val();
			if (display == '') {
				alert("Can't delete!");
				return;
			} else if (display != '' && compute.getExpression() == '') {
				$('input.result').val(display.substring(0, display.length - 1));
				return;
			}
			compute.deleteExpression();
		} else {
			compute.appendToExpression(this.value);
		}
		
		$('input.result').val(compute.getExpression());
	});
});
