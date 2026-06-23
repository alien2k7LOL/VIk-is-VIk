const COURSES = [
{
  id:'algebra-1', title:'Algebra 1', icon:'📐', color:'#6366f1',
  description:'Build your mathematical foundation with variables, equations, functions, and graphing.',
  units:[
    { id:'a1-u1', title:'Foundations', topics:[
      { id:'a1-u1-t1', title:'Variables & Expressions',
        explanation:`<p>A <strong>variable</strong> is a symbol (usually a letter) that represents an unknown value. An <strong>algebraic expression</strong> combines numbers, variables, and operations like addition, subtraction, multiplication, and division.</p><p>To <strong>evaluate</strong> an expression, substitute values for the variables and simplify. To <strong>simplify</strong>, combine like terms — terms that have the same variable raised to the same power.</p>`,
        vocabulary:[
          {term:'Variable',definition:'A symbol (usually a letter) that represents an unknown or changing value.'},
          {term:'Algebraic expression',definition:'A combination of numbers, variables, and operations (addition, subtraction, multiplication, division).'},
          {term:'Evaluate',definition:'To substitute given values for variables and compute the result.'},
          {term:'Simplify',definition:'To rewrite an expression in a simpler form by combining like terms and applying properties.'},
          {term:'Like terms',definition:'Terms that have the same variable(s) raised to the same power; they can be combined.'}
        ],
        keyFormulas:['a + b = b + a \\text{ (commutative)}','a(b + c) = ab + ac \\text{ (distributive)}','a + 0 = a,\\; a \\cdot 1 = a \\text{ (identity)}'],
        videos:[{title:'Adding and Subtracting Polynomials — Algebra Basics',videoId:'ZGl2ExHwdak',channel:'Khan Academy',summary:'Shows how to add and subtract polynomial expressions and combine like terms. Best for Algebra 1 students learning variables and expressions or anyone reviewing polynomial basics.'},{title:'Solving a Quadratic by Factoring — Step-by-Step',videoId:'N30tN9158Kc',channel:'Khan Academy',summary:'Walks through solving quadratic equations by factoring, with multiple examples. Ideal for students in Algebra 1 or Algebra 2 who are learning equation-solving strategies.'}],
        problems:[
          {question:'Evaluate \\(3x + 5\\) when \\(x = 4\\).',options:['17','12','20','7'],correct:0,solution:'Substitute x = 4: 3(4) + 5 = 12 + 5 = 17'},
          {question:'Simplify: \\(7a + 3b - 2a + b\\)',options:['\\(5a + 4b\\)','\\(9a + 4b\\)','\\(5a + 2b\\)','\\(10ab\\)'],correct:0,solution:'Combine like terms: (7a - 2a) + (3b + b) = 5a + 4b'},
          {question:'Which property does \\(3(x+2) = 3x+6\\) demonstrate?',options:['Distributive','Commutative','Associative','Identity'],correct:0,solution:'Multiplying 3 by each term inside the parentheses is the distributive property.'}
        ]},
      { id:'a1-u1-t2', title:'Order of Operations',
        explanation:`<p>The <strong>order of operations</strong> (PEMDAS) dictates the sequence for evaluating expressions: <strong>P</strong>arentheses, <strong>E</strong>xponents, <strong>M</strong>ultiplication and <strong>D</strong>ivision (left to right), then <strong>A</strong>ddition and <strong>S</strong>ubtraction (left to right).</p><p>Always work from the innermost grouping symbol outward, and handle multiplication/division before addition/subtraction at the same level.</p>`,
        vocabulary:[
          {term:'PEMDAS',definition:'The order of operations: Parentheses, Exponents, Multiplication and Division (left to right), Addition and Subtraction (left to right).'},
          {term:'Expression',definition:'A mathematical phrase that can contain numbers, variables, and operators.'},
          {term:'Evaluate',definition:'To find the value of an expression by following the order of operations.'}
        ],
        keyFormulas:['\\text{PEMDAS: Parentheses, Exponents, Multiply/Divide, Add/Subtract}'],
        videos:[{title:'Order of Operations — Evaluating Expressions Correctly',videoId:'dAgfnK528RA',channel:'Khan Academy',summary:'Explains PEMDAS and how to evaluate expressions with parentheses, exponents, and mixed operations. For anyone in Algebra 1 or Pre-Algebra who needs to master the correct order of operations.'},{title:'PEMDAS Explained — Parentheses, Exponents, Multiply, Add',videoId:'WJqw-cxvKgo',channel:'Organic Chemistry Tutor',summary:'Reinforces the order of operations with clear examples. Recommended for students who need extra practice with PEMDAS before moving on to harder algebra.'}],
        problems:[
          {question:'Evaluate: \\(3 + 4 \\times 2\\)',options:['11','14','10','24'],correct:0,solution:'Multiply first: 4 × 2 = 8, then add: 3 + 8 = 11'},
          {question:'Evaluate: \\((6 + 2)^2 \\div 4\\)',options:['16','4','10','64'],correct:0,solution:'Parentheses: 8, then exponent: 64, then divide: 64 ÷ 4 = 16'},
          {question:'Evaluate: \\(5 \\times 3 - 8 \\div 2 + 1\\)',options:['12','8','4','16'],correct:0,solution:'Multiply: 15, divide: 4, then left to right: 15 - 4 + 1 = 12'}
        ]}
    ]},
    { id:'a1-u2', title:'Solving Equations', topics:[
      { id:'a1-u2-t1', title:'One-Step & Two-Step Equations',
        explanation:`<p>To solve an equation, isolate the variable by performing <strong>inverse operations</strong> on both sides. For one-step equations, a single operation suffices. For two-step equations, undo addition/subtraction first, then multiplication/division.</p><p>Always check your solution by substituting it back into the original equation.</p>`,
        keyFormulas:['\\text{If } a + b = c, \\text{ then } a = c - b','\\text{If } ax = b, \\text{ then } x = \\frac{b}{a}'],
        videos:[{title:'Solving One-Step Equations',videoId:'l3XzepN03KQ',channel:'Khan Academy'},{title:'Two-Step Equations',videoId:'_y_Q3_B2Vh8',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Solve: \\(x + 7 = 15\\)',options:['\\(x=8\\)','\\(x=22\\)','\\(x=7\\)','\\(x=-8\\)'],correct:0,solution:'Subtract 7 from both sides: x = 15 - 7 = 8'},
          {question:'Solve: \\(3x - 4 = 11\\)',options:['\\(x=5\\)','\\(x=3\\)','\\(x=7\\)','\\(x=15\\)'],correct:0,solution:'Add 4: 3x = 15, then divide by 3: x = 5'},
          {question:'Solve: \\(\\frac{n}{4} + 3 = 7\\)',options:['\\(n=16\\)','\\(n=4\\)','\\(n=10\\)','\\(n=28\\)'],correct:0,solution:'Subtract 3: n/4 = 4, multiply by 4: n = 16'}
        ]},
      { id:'a1-u2-t2', title:'Multi-Step Equations',
        explanation:`<p><strong>Multi-step equations</strong> require combining like terms, distributing, and moving variable terms to one side. Follow this strategy: distribute, combine like terms on each side, use inverse operations to collect variables on one side and constants on the other.</p>`,
        keyFormulas:['a(b+c) = ab + ac','\\text{Collect variables on one side, constants on the other}'],
        videos:[{title:'Multi-Step Equations',videoId:'2PqjuSJKxKI',channel:'Khan Academy'},{title:'Equations with Variables on Both Sides',videoId:'LGRmFbxFBbI',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Solve: \\(2(x+3) = 16\\)',options:['\\(x=5\\)','\\(x=8\\)','\\(x=6.5\\)','\\(x=10\\)'],correct:0,solution:'Distribute: 2x + 6 = 16, subtract 6: 2x = 10, divide: x = 5'},
          {question:'Solve: \\(5x - 3 = 2x + 9\\)',options:['\\(x=4\\)','\\(x=3\\)','\\(x=6\\)','\\(x=2\\)'],correct:0,solution:'Subtract 2x: 3x - 3 = 9, add 3: 3x = 12, divide: x = 4'},
          {question:'Solve: \\(3(2x-1) = 4x + 5\\)',options:['\\(x=4\\)','\\(x=2\\)','\\(x=3\\)','\\(x=1\\)'],correct:0,solution:'Distribute: 6x - 3 = 4x + 5, subtract 4x: 2x - 3 = 5, add 3: 2x = 8, x = 4'}
        ]}
    ]},
    { id:'a1-u3', title:'Inequalities', topics:[
      { id:'a1-u3-t1', title:'Solving Linear Inequalities',
        explanation:`<p>Inequalities are solved like equations with one critical rule: <strong>flip the inequality sign when multiplying or dividing by a negative number</strong>. Solutions are graphed on a number line with open circles for strict inequalities and closed circles for inclusive ones.</p>`,
        keyFormulas:['\\text{If } ax > b \\text{ and } a > 0,\\; x > \\frac{b}{a}','\\text{If } ax > b \\text{ and } a < 0,\\; x < \\frac{b}{a}'],
        videos:[{title:'Solving Inequalities',videoId:'VgDe_D8ojxw',channel:'Khan Academy'},{title:'Linear Inequalities',videoId:'2cQjqAZ8FoE',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Solve: \\(2x + 3 > 11\\)',options:['\\(x > 4\\)','\\(x > 7\\)','\\(x < 4\\)','\\(x > 5.5\\)'],correct:0,solution:'Subtract 3: 2x > 8, divide by 2: x > 4'},
          {question:'Solve: \\(-3x \\leq 12\\)',options:['\\(x \\geq -4\\)','\\(x \\leq -4\\)','\\(x \\geq 4\\)','\\(x \\leq 4\\)'],correct:0,solution:'Divide by -3 and flip: x ≥ -4'},
          {question:'Solve: \\(5 - x < 2\\)',options:['\\(x > 3\\)','\\(x < 3\\)','\\(x > -3\\)','\\(x < 7\\)'],correct:0,solution:'Subtract 5: -x < -3, multiply by -1 and flip: x > 3'}
        ]},
      { id:'a1-u3-t2', title:'Compound & Absolute Value Inequalities',
        explanation:`<p><strong>Compound inequalities</strong> join two inequalities with "and" (intersection) or "or" (union). <strong>Absolute value inequalities</strong> like \\(|x| < a\\) become \\(-a < x < a\\), while \\(|x| > a\\) becomes \\(x < -a\\) or \\(x > a\\).</p>`,
        keyFormulas:['|x| < a \\Rightarrow -a < x < a','|x| > a \\Rightarrow x < -a \\text{ or } x > a'],
        videos:[{title:'Compound Inequalities',videoId:'0YErxSShF0A',channel:'Khan Academy'},{title:'Absolute Value Inequalities',videoId:'DPuK6ZgBGmE',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Solve: \\(|x - 3| < 5\\)',options:['\\(-2 < x < 8\\)','\\(x < 8\\)','\\(x > -2\\)','\\(-5 < x < 5\\)'],correct:0,solution:'Split: -5 < x - 3 < 5, add 3: -2 < x < 8'},
          {question:'Solve: \\(|2x + 1| \\geq 7\\)',options:['\\(x \\leq -4\\) or \\(x \\geq 3\\)','\\(-4 \\leq x \\leq 3\\)','\\(x \\geq 3\\)','\\(x \\leq -4\\)'],correct:0,solution:'2x+1 ≤ -7 → x ≤ -4, or 2x+1 ≥ 7 → x ≥ 3'},
          {question:'Solve: \\(1 < 2x - 3 < 9\\)',options:['\\(2 < x < 6\\)','\\(1 < x < 9\\)','\\(-1 < x < 3\\)','\\(4 < x < 12\\)'],correct:0,solution:'Add 3 to all parts: 4 < 2x < 12, divide by 2: 2 < x < 6'}
        ]}
    ]},
    { id:'a1-u4', title:'Linear Functions', topics:[
      { id:'a1-u4-t1', title:'Slope & Rate of Change',
        explanation:`<p><strong>Slope</strong> measures the steepness and direction of a line. It equals the ratio of vertical change (rise) to horizontal change (run) between any two points. A positive slope rises left to right; a negative slope falls. Horizontal lines have slope 0; vertical lines have undefined slope.</p>`,
        keyFormulas:['m = \\frac{y_2 - y_1}{x_2 - x_1}','m = \\frac{\\text{rise}}{\\text{run}}'],
        videos:[{title:'Intro to Slope',videoId:'R948Tsyq4vA',channel:'Khan Academy'},{title:'Slope Formula',videoId:'WkspBxrzuZo',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find the slope between \\((2,3)\\) and \\((6,11)\\).',options:['2','4','\\(\\frac{1}{2}\\)','8'],correct:0,solution:'m = (11-3)/(6-2) = 8/4 = 2'},
          {question:'A horizontal line has slope:',options:['0','Undefined','1','-1'],correct:0,solution:'Horizontal lines have zero rise, so slope = 0/run = 0'},
          {question:'Find the slope between \\((-1,4)\\) and \\((3,-2)\\).',options:['\\(-\\frac{3}{2}\\)','\\(\\frac{3}{2}\\)','\\(-\\frac{2}{3}\\)','\\(\\frac{2}{3}\\)'],correct:0,solution:'m = (-2-4)/(3-(-1)) = -6/4 = -3/2'}
        ]},
      { id:'a1-u4-t2', title:'Slope-Intercept & Point-Slope Form',
        explanation:`<p><strong>Slope-intercept form</strong> \\(y = mx + b\\) immediately shows the slope \\(m\\) and y-intercept \\(b\\). <strong>Point-slope form</strong> \\(y - y_1 = m(x - x_1)\\) is useful when you know a point and slope. Both forms represent the same line and are interconvertible.</p>`,
        keyFormulas:['y = mx + b \\text{ (slope-intercept)}','y - y_1 = m(x - x_1) \\text{ (point-slope)}','Ax + By = C \\text{ (standard form)}'],
        videos:[{title:'Slope-Intercept Form',videoId:'IL3UCuXrUzE',channel:'Khan Academy'},{title:'Point-Slope Form',videoId:'K_OI9LA54AA',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'What is the slope and y-intercept of \\(y = -2x + 5\\)?',options:['m=-2, b=5','m=2, b=5','m=-2, b=-5','m=5, b=-2'],correct:0,solution:'In y = mx + b form, m = -2 (slope) and b = 5 (y-intercept)'},
          {question:'Write the equation through \\((3,7)\\) with slope 2 in slope-intercept form.',options:['\\(y = 2x + 1\\)','\\(y = 2x + 7\\)','\\(y = 2x - 1\\)','\\(y = 2x + 3\\)'],correct:0,solution:'Point-slope: y - 7 = 2(x - 3) → y = 2x - 6 + 7 → y = 2x + 1'},
          {question:'Find the equation of the line through \\((0,-3)\\) and \\((2,1)\\).',options:['\\(y = 2x - 3\\)','\\(y = -2x + 3\\)','\\(y = 2x + 3\\)','\\(y = x - 3\\)'],correct:0,solution:'m = (1-(-3))/(2-0) = 4/2 = 2, b = -3, so y = 2x - 3'}
        ]}
    ]},
    { id:'a1-u5', title:'Systems of Equations', topics:[
      { id:'a1-u5-t1', title:'Solving by Substitution & Elimination',
        explanation:`<p>A <strong>system of equations</strong> has two or more equations with the same variables. <strong>Substitution</strong>: solve one equation for a variable, plug into the other. <strong>Elimination</strong>: add or subtract equations to cancel a variable. The solution is the intersection point of the lines.</p>`,
        keyFormulas:['\\text{Substitution: Solve for one variable, substitute}','\\text{Elimination: Add/subtract equations to cancel a variable}'],
        videos:[{title:'Systems by Substitution',videoId:'nok99JOhcjo',channel:'Khan Academy'},{title:'Systems by Elimination',videoId:'clY_pbtBneA',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Solve: \\(y = 2x + 1\\) and \\(y = -x + 7\\)',options:['\\((2, 5)\\)','\\((3, 4)\\)','\\((1, 3)\\)','\\((4, 3)\\)'],correct:0,solution:'Set equal: 2x + 1 = -x + 7 → 3x = 6 → x = 2, y = 5'},
          {question:'Solve: \\(x + y = 10\\) and \\(x - y = 4\\)',options:['\\((7, 3)\\)','\\((5, 5)\\)','\\((6, 4)\\)','\\((8, 2)\\)'],correct:0,solution:'Add equations: 2x = 14 → x = 7, then y = 3'},
          {question:'Solve: \\(2x + 3y = 12\\) and \\(x = y + 1\\)',options:['\\((3, 2)\\)','\\((2, 3)\\)','\\((4, 1)\\)','\\((1, 4)\\)'],correct:0,solution:'Substitute: 2(y+1) + 3y = 12 → 5y + 2 = 12 → y = 2, x = 3'}
        ]}
    ]},
    { id:'a1-u6', title:'Exponents & Polynomials', topics:[
      { id:'a1-u6-t1', title:'Laws of Exponents',
        explanation:`<p>Exponent rules let you simplify expressions with powers. The key rules: multiply powers by adding exponents, divide by subtracting, and raise a power to a power by multiplying. Any nonzero number to the zero power equals 1, and negative exponents create fractions.</p>`,
        keyFormulas:['a^m \\cdot a^n = a^{m+n}','\\frac{a^m}{a^n} = a^{m-n}','(a^m)^n = a^{mn}','a^0 = 1,\\; a^{-n} = \\frac{1}{a^n}'],
        videos:[{title:'Exponent Rules',videoId:'kZlRr_pzRmc',channel:'Khan Academy'},{title:'Laws of Exponents',videoId:'etMK3xViMAc',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Simplify: \\(x^3 \\cdot x^5\\)',options:['\\(x^8\\)','\\(x^{15}\\)','\\(x^2\\)','\\(2x^8\\)'],correct:0,solution:'Add exponents: x^(3+5) = x^8'},
          {question:'Simplify: \\(\\frac{a^7}{a^3}\\)',options:['\\(a^4\\)','\\(a^{10}\\)','\\(a^{7/3}\\)','\\(a^{21}\\)'],correct:0,solution:'Subtract exponents: a^(7-3) = a^4'},
          {question:'Simplify: \\((2x^3)^2\\)',options:['\\(4x^6\\)','\\(2x^6\\)','\\(4x^5\\)','\\(2x^9\\)'],correct:0,solution:'Square both: 2² · (x³)² = 4x^6'}
        ]},
      { id:'a1-u6-t2', title:'Operations with Polynomials',
        explanation:`<p>A <strong>polynomial</strong> is a sum of terms with variables raised to whole-number powers. Add/subtract polynomials by combining like terms. Multiply using the distributive property (FOIL for binomials). The degree is the highest exponent.</p>`,
        keyFormulas:['(a+b)(c+d) = ac + ad + bc + bd','(a+b)^2 = a^2 + 2ab + b^2','(a-b)(a+b) = a^2 - b^2'],
        videos:[{title:'Adding & Subtracting Polynomials',videoId:'HB52UTcAv0g',channel:'Khan Academy'},{title:'Multiplying Polynomials FOIL',videoId:'bFtjG45-Udk',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Multiply: \\((x+3)(x+5)\\)',options:['\\(x^2+8x+15\\)','\\(x^2+15x+8\\)','\\(x^2+8x+8\\)','\\(2x+8\\)'],correct:0,solution:'FOIL: x² + 5x + 3x + 15 = x² + 8x + 15'},
          {question:'Expand: \\((2x-1)^2\\)',options:['\\(4x^2-4x+1\\)','\\(4x^2-1\\)','\\(4x^2+4x+1\\)','\\(2x^2-2x+1\\)'],correct:0,solution:'(2x)² - 2(2x)(1) + 1² = 4x² - 4x + 1'},
          {question:'Simplify: \\((3x^2+2x) - (x^2-5x)\\)',options:['\\(2x^2+7x\\)','\\(2x^2-3x\\)','\\(4x^2+7x\\)','\\(4x^2-3x\\)'],correct:0,solution:'Distribute negative: 3x²+2x-x²+5x = 2x²+7x'}
        ]}
    ]},
    { id:'a1-u7', title:'Factoring', topics:[
      { id:'a1-u7-t1', title:'Factoring Techniques',
        explanation:`<p><strong>Factoring</strong> reverses multiplication to write an expression as a product. Start by pulling out the <strong>GCF</strong> (greatest common factor). For trinomials \\(x^2+bx+c\\), find two numbers that multiply to \\(c\\) and add to \\(b\\). Recognize special patterns like difference of squares and perfect square trinomials.</p>`,
        keyFormulas:['a^2 - b^2 = (a-b)(a+b)','x^2 + bx + c = (x+p)(x+q) \\text{ where } pq=c,\\; p+q=b','a^2 \\pm 2ab + b^2 = (a \\pm b)^2'],
        videos:[{title:'Factoring Trinomials',videoId:'eF6zYNzlZKQ',channel:'Khan Academy'},{title:'Factoring Completely',videoId:'MnGfA2uO6C8',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Factor: \\(x^2 + 7x + 12\\)',options:['\\((x+3)(x+4)\\)','\\((x+2)(x+6)\\)','\\((x+1)(x+12)\\)','\\((x+6)(x+1)\\)'],correct:0,solution:'Find two numbers multiplying to 12 and adding to 7: 3 and 4'},
          {question:'Factor: \\(x^2 - 9\\)',options:['\\((x-3)(x+3)\\)','\\((x-9)(x+1)\\)','\\((x-3)^2\\)','\\((x+9)(x-1)\\)'],correct:0,solution:'Difference of squares: x² - 3² = (x-3)(x+3)'},
          {question:'Factor: \\(2x^2 + 6x\\)',options:['\\(2x(x+3)\\)','\\(x(2x+6)\\)','\\(2(x^2+3x)\\)','\\(6x(x+1)\\)'],correct:0,solution:'GCF is 2x: 2x(x + 3)'}
        ]}
    ]},
    { id:'a1-u8', title:'Quadratic Functions', topics:[
      { id:'a1-u8-t1', title:'Graphing Parabolas',
        explanation:`<p>A <strong>quadratic function</strong> \\(f(x) = ax^2 + bx + c\\) graphs as a parabola. If \\(a > 0\\) it opens upward; if \\(a < 0\\) it opens downward. The <strong>vertex</strong> is the minimum or maximum point, found at \\(x = -b/(2a)\\). The <strong>axis of symmetry</strong> is the vertical line through the vertex.</p>`,
        keyFormulas:['f(x) = ax^2 + bx + c','\\text{Vertex: } x = -\\frac{b}{2a}','f(x) = a(x-h)^2 + k \\text{ (vertex form, vertex at }(h,k)\\text{)}'],
        videos:[{title:'Graphing Quadratics',videoId:'IhYmUHGNj_I',channel:'Khan Academy'},{title:'Vertex Form of Parabola',videoId:'Hq2Up_1vNSo',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find the vertex of \\(f(x) = x^2 - 4x + 7\\).',options:['\\((2, 3)\\)','\\((-2, 15)\\)','\\((4, 7)\\)','\\((2, 7)\\)'],correct:0,solution:'x = -(-4)/(2·1) = 2, f(2) = 4 - 8 + 7 = 3. Vertex: (2, 3)'},
          {question:'Does \\(f(x) = -3x^2 + 2\\) open up or down?',options:['Down','Up','Neither','Both'],correct:0,solution:'Since a = -3 < 0, the parabola opens downward'},
          {question:'What is the axis of symmetry of \\(y = 2x^2 + 8x + 1\\)?',options:['\\(x = -2\\)','\\(x = 2\\)','\\(x = -4\\)','\\(x = 4\\)'],correct:0,solution:'x = -b/(2a) = -8/(2·2) = -8/4 = -2'}
        ]},
      { id:'a1-u8-t2', title:'Quadratic Formula & Discriminant',
        explanation:`<p>The <strong>quadratic formula</strong> solves any equation \\(ax^2+bx+c=0\\). The <strong>discriminant</strong> \\(b^2-4ac\\) determines the nature of solutions: positive gives two real solutions, zero gives one (repeated), and negative gives no real solutions (complex roots).</p>`,
        keyFormulas:['x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}','\\Delta = b^2 - 4ac','\\Delta > 0: \\text{2 real}, \\; \\Delta = 0: \\text{1 real}, \\; \\Delta < 0: \\text{no real}'],
        videos:[{title:'Quadratic Formula',videoId:'i7idZfS8t8w',channel:'Khan Academy'},{title:'Discriminant Explained',videoId:'a1nnUA_DYm0',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Solve \\(x^2 - 5x + 6 = 0\\) using the quadratic formula.',options:['\\(x=2\\) and \\(x=3\\)','\\(x=-2\\) and \\(x=-3\\)','\\(x=1\\) and \\(x=6\\)','\\(x=5\\) and \\(x=1\\)'],correct:0,solution:'x = (5 ± √(25-24))/2 = (5 ± 1)/2, so x = 3 or x = 2'},
          {question:'How many real solutions does \\(x^2 + 2x + 5 = 0\\) have?',options:['0','1','2','Infinite'],correct:0,solution:'Discriminant: 4 - 20 = -16 < 0, so no real solutions'},
          {question:'Find the discriminant of \\(3x^2 - 6x + 3 = 0\\).',options:['0','12','-12','36'],correct:0,solution:'Δ = (-6)² - 4(3)(3) = 36 - 36 = 0 (one repeated solution)'}
        ]}
    ]}
  ]
},
{
  id:'geometry', title:'Geometry', icon:'📏', color:'#ec4899',
  description:'Explore shapes, angles, proofs, and spatial reasoning from triangles to circles.',
  units:[
    { id:'g-u1', title:'Foundations of Geometry', topics:[
      { id:'g-u1-t1', title:'Points, Lines & Planes',
        explanation:`<p>Geometry begins with undefined terms: a <strong>point</strong> has no size (just location), a <strong>line</strong> extends infinitely in both directions, and a <strong>plane</strong> is a flat surface extending infinitely. These building blocks define all geometric figures. <strong>Collinear points</strong> lie on the same line; <strong>coplanar points</strong> lie on the same plane.</p>`,
        keyFormulas:['\\text{Two points determine a line}','\\text{Three non-collinear points determine a plane}'],
        videos:[{title:'Points, Lines, Planes',videoId:'k5etrWdIY6o',channel:'Khan Academy'},{title:'Basic Geometry Concepts',videoId:'GRBMNsGMfm0',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'How many lines can pass through two distinct points?',options:['Exactly 1','2','Infinite','0'],correct:0,solution:'Two distinct points determine exactly one line.'},
          {question:'Points that lie on the same line are called:',options:['Collinear','Coplanar','Concurrent','Congruent'],correct:0,solution:'Collinear means lying on the same line.'},
          {question:'Three non-collinear points determine:',options:['A plane','A line','A point','A ray'],correct:0,solution:'Three non-collinear points determine exactly one plane.'}
        ]},
      { id:'g-u1-t2', title:'Segment & Angle Measurement',
        explanation:`<p>A <strong>segment</strong> is part of a line with two endpoints, measured by distance. The <strong>midpoint</strong> divides a segment into two equal parts. An <strong>angle</strong> is formed by two rays sharing an endpoint (vertex), measured in degrees. Angles are classified as acute (< 90°), right (90°), obtuse (> 90°), or straight (180°).</p>`,
        keyFormulas:['d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}','M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)','\\text{Complementary: } a + b = 90°, \\; \\text{Supplementary: } a + b = 180°'],
        videos:[{title:'Distance & Midpoint Formulas',videoId:'nyZuite17Pc',channel:'Khan Academy'},{title:'Angle Types & Measurement',videoId:'pGWoGQjlqGA',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find the distance between \\((1,2)\\) and \\((4,6)\\).',options:['5','7','\\(\\sqrt{7}\\)','25'],correct:0,solution:'d = √((4-1)²+(6-2)²) = √(9+16) = √25 = 5'},
          {question:'Find the midpoint of \\((2,8)\\) and \\((6,4)\\).',options:['\\((4,6)\\)','\\((3,6)\\)','\\((4,4)\\)','\\((8,12)\\)'],correct:0,solution:'M = ((2+6)/2, (8+4)/2) = (4, 6)'},
          {question:'Two complementary angles: one is 35°. Find the other.',options:['55°','145°','35°','65°'],correct:0,solution:'Complementary angles sum to 90°: 90 - 35 = 55°'}
        ]}
    ]},
    { id:'g-u2', title:'Parallel & Perpendicular Lines', topics:[
      { id:'g-u2-t1', title:'Parallel Lines & Transversals',
        explanation:`<p>When a <strong>transversal</strong> crosses parallel lines, it creates special angle pairs: <strong>corresponding angles</strong> are equal, <strong>alternate interior angles</strong> are equal, <strong>alternate exterior angles</strong> are equal, and <strong>co-interior (same-side interior) angles</strong> are supplementary (sum to 180°).</p>`,
        keyFormulas:['\\text{Corresponding angles are congruent}','\\text{Alternate interior angles are congruent}','\\text{Co-interior angles are supplementary (sum = 180°)}'],
        videos:[{title:'Parallel Lines & Transversals',videoId:'H-E5rlpCVu4',channel:'Khan Academy'},{title:'Angle Relationships',videoId:'V0xounpGMGI',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'If two parallel lines are cut by a transversal and one angle is 65°, its alternate interior angle is:',options:['65°','115°','25°','180°'],correct:0,solution:'Alternate interior angles are congruent when lines are parallel: 65°'},
          {question:'Co-interior angles with parallel lines are:',options:['Supplementary','Complementary','Congruent','Vertical'],correct:0,solution:'Co-interior (same-side interior) angles sum to 180°, so they are supplementary.'},
          {question:'Corresponding angles formed by parallel lines and a transversal are always:',options:['Congruent','Supplementary','Complementary','Adjacent'],correct:0,solution:'Corresponding angles are congruent when lines are parallel.'}
        ]}
    ]},
    { id:'g-u3', title:'Triangles', topics:[
      { id:'g-u3-t1', title:'Triangle Congruence (SSS, SAS, ASA, AAS)',
        explanation:`<p>Two triangles are <strong>congruent</strong> if all corresponding sides and angles are equal. You can prove congruence using shortcuts: <strong>SSS</strong> (three sides), <strong>SAS</strong> (two sides and included angle), <strong>ASA</strong> (two angles and included side), or <strong>AAS</strong> (two angles and a non-included side). Note: SSA is NOT a valid congruence theorem.</p>`,
        keyFormulas:['\\text{SSS: three pairs of sides congruent}','\\text{SAS: two sides and included angle}','\\text{ASA: two angles and included side}','\\text{AAS: two angles and non-included side}'],
        videos:[{title:'Triangle Congruence Theorems',videoId:'8Ld8Csu4sEs',channel:'Khan Academy'},{title:'Proving Triangles Congruent',videoId:'BbX44YoGSJE',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Which is NOT a valid triangle congruence theorem?',options:['SSA','SSS','SAS','ASA'],correct:0,solution:'SSA (Side-Side-Angle) does not guarantee congruence — it can produce two different triangles.'},
          {question:'If two triangles share two sides and the included angle, they are congruent by:',options:['SAS','SSA','AAS','SSS'],correct:0,solution:'Two sides and the included angle is the SAS postulate.'},
          {question:'After proving triangles congruent, corresponding parts are congruent by:',options:['CPCTC','SSS','ASA','Reflexive'],correct:0,solution:'CPCTC: Corresponding Parts of Congruent Triangles are Congruent.'}
        ]},
      { id:'g-u3-t2', title:'Triangle Angle Sum & Exterior Angles',
        explanation:`<p>The sum of interior angles in any triangle is <strong>180°</strong>. An <strong>exterior angle</strong> of a triangle equals the sum of the two non-adjacent interior angles (Exterior Angle Theorem). These properties are fundamental for finding missing angle measures.</p>`,
        keyFormulas:['A + B + C = 180°','\\text{Exterior angle} = \\text{sum of two remote interior angles}'],
        videos:[{title:'Triangle Angle Sum',videoId:'hmj3_zbz2eg',channel:'Khan Academy'},{title:'Exterior Angle Theorem',videoId:'OE_yp4bkFOg',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'A triangle has angles 45° and 75°. Find the third angle.',options:['60°','55°','80°','90°'],correct:0,solution:'180° - 45° - 75° = 60°'},
          {question:'An exterior angle of a triangle is 120°. One remote interior angle is 50°. Find the other.',options:['70°','60°','130°','50°'],correct:0,solution:'Exterior = sum of remote interiors: 120° - 50° = 70°'},
          {question:'Can a triangle have two right angles?',options:['No','Yes','Only isosceles','Only equilateral'],correct:0,solution:'Two right angles = 180°, leaving 0° for the third angle, which is impossible.'}
        ]}
    ]},
    { id:'g-u4', title:'Similarity', topics:[
      { id:'g-u4-t1', title:'Similar Figures & Proportions',
        explanation:`<p><strong>Similar figures</strong> have the same shape but different sizes — corresponding angles are equal and corresponding sides are proportional. The <strong>scale factor</strong> is the ratio of corresponding side lengths. Similarity can be proven by <strong>AA</strong> (two pairs of congruent angles), <strong>SSS~</strong>, or <strong>SAS~</strong>.</p>`,
        keyFormulas:['\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2} = k \\text{ (scale factor)}','\\text{AA Similarity: two pairs of congruent angles}'],
        videos:[{title:'Similar Triangles',videoId:'e6sh8AXz41E',channel:'Khan Academy'},{title:'Similarity & Proportions',videoId:'TiOlCuaBIBs',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Triangles with sides 3,4,5 and 6,8,10 are:',options:['Similar (k=2)','Congruent','Neither','Similar (k=3)'],correct:0,solution:'All ratios equal: 6/3 = 8/4 = 10/5 = 2. Similar with scale factor 2.'},
          {question:'Which postulate proves similarity using two angle pairs?',options:['AA','SSS~','SAS~','ASA'],correct:0,solution:'AA (Angle-Angle) similarity requires just two pairs of congruent angles.'},
          {question:'If two similar triangles have scale factor 3, and the smaller has perimeter 12, the larger has perimeter:',options:['36','4','15','48'],correct:0,solution:'Perimeters scale by the same factor: 12 × 3 = 36'}
        ]}
    ]},
    { id:'g-u5', title:'Right Triangles & Trigonometry', topics:[
      { id:'g-u5-t1', title:'Pythagorean Theorem',
        explanation:`<p>In a right triangle, the square of the <strong>hypotenuse</strong> (longest side, opposite the right angle) equals the sum of the squares of the two legs: \\(a^2 + b^2 = c^2\\). This theorem allows you to find any missing side. <strong>Pythagorean triples</strong> are integer solutions like 3-4-5, 5-12-13, and 8-15-17.</p>`,
        keyFormulas:['a^2 + b^2 = c^2','\\text{Common triples: } 3\\text{-}4\\text{-}5, \\; 5\\text{-}12\\text{-}13, \\; 8\\text{-}15\\text{-}17'],
        videos:[{title:'Pythagorean Theorem',videoId:'AEIzy1kNRqo',channel:'Khan Academy'},{title:'Pythagorean Theorem Problems',videoId:'WqhlG3Vakw8',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'A right triangle has legs 6 and 8. Find the hypotenuse.',options:['10','14','48','100'],correct:0,solution:'c² = 6² + 8² = 36 + 64 = 100, c = 10'},
          {question:'A right triangle has hypotenuse 13 and one leg 5. Find the other leg.',options:['12','8','18','144'],correct:0,solution:'a² = 13² - 5² = 169 - 25 = 144, a = 12'},
          {question:'Is a triangle with sides 7, 24, 25 a right triangle?',options:['Yes','No','Not enough info','Only if isosceles'],correct:0,solution:'7² + 24² = 49 + 576 = 625 = 25². Yes, it is a right triangle.'}
        ]},
      { id:'g-u5-t2', title:'Trigonometric Ratios (SOH-CAH-TOA)',
        explanation:`<p>The three primary <strong>trigonometric ratios</strong> relate angles to sides in right triangles. <strong>SOH-CAH-TOA</strong>: Sine = Opposite/Hypotenuse, Cosine = Adjacent/Hypotenuse, Tangent = Opposite/Adjacent. These ratios let you find missing sides or angles in any right triangle.</p>`,
        keyFormulas:['\\sin\\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}}','\\cos\\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}','\\tan\\theta = \\frac{\\text{opposite}}{\\text{adjacent}}'],
        videos:[{title:'Intro to Trigonometry',videoId:'Jsiy4TxgIME',channel:'Khan Academy'},{title:'SOH CAH TOA',videoId:'PUB0TaZ7bhA',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'In a right triangle, opposite = 3, hypotenuse = 5. Find \\(\\sin\\theta\\).',options:['\\(\\frac{3}{5}\\)','\\(\\frac{4}{5}\\)','\\(\\frac{5}{3}\\)','\\(\\frac{3}{4}\\)'],correct:0,solution:'sin θ = opposite/hypotenuse = 3/5'},
          {question:'If \\(\\cos\\theta = \\frac{12}{13}\\), find the opposite side (hyp = 13).',options:['5','12','1','13'],correct:0,solution:'adjacent = 12, hyp = 13, opposite = √(169-144) = √25 = 5'},
          {question:'Find \\(\\tan 45°\\).',options:['1','0','\\(\\frac{\\sqrt{2}}{2}\\)','Undefined'],correct:0,solution:'In a 45-45-90 triangle, both legs are equal, so tan 45° = 1'}
        ]}
    ]},
    { id:'g-u6', title:'Circles', topics:[
      { id:'g-u6-t1', title:'Circle Properties & Arc Length',
        explanation:`<p>A <strong>circle</strong> is the set of all points equidistant from a center. Key parts: <strong>radius</strong> (center to edge), <strong>diameter</strong> (through center, = 2r), <strong>chord</strong> (connects two points on the circle). <strong>Arc length</strong> is a portion of the circumference, and a <strong>sector</strong> is the region between two radii.</p>`,
        keyFormulas:['C = 2\\pi r = \\pi d','A = \\pi r^2','\\text{Arc length} = \\frac{\\theta}{360°} \\cdot 2\\pi r','\\text{Sector area} = \\frac{\\theta}{360°} \\cdot \\pi r^2'],
        videos:[{title:'Circle Formulas',videoId:'ZyOhRgnFmIY',channel:'Khan Academy'},{title:'Arc Length & Sector Area',videoId:'Iu_s1yE1FcI',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find the circumference of a circle with radius 7.',options:['\\(14\\pi\\)','\\(7\\pi\\)','\\(49\\pi\\)','\\(28\\pi\\)'],correct:0,solution:'C = 2πr = 2π(7) = 14π'},
          {question:'Find the arc length for a 90° arc on a circle with radius 10.',options:['\\(5\\pi\\)','\\(10\\pi\\)','\\(20\\pi\\)','\\(25\\pi\\)'],correct:0,solution:'Arc = (90/360) × 2π(10) = (1/4)(20π) = 5π'},
          {question:'Area of a circle with diameter 12:',options:['\\(36\\pi\\)','\\(12\\pi\\)','\\(144\\pi\\)','\\(24\\pi\\)'],correct:0,solution:'r = 6, A = π(6)² = 36π'}
        ]}
    ]},
    { id:'g-u7', title:'Area & Volume', topics:[
      { id:'g-u7-t1', title:'Volume of Solids',
        explanation:`<p><strong>Volume</strong> measures 3D space inside a solid. Key formulas: prism = base area × height, cylinder = \\(\\pi r^2 h\\), cone = \\(\\frac{1}{3}\\pi r^2 h\\), sphere = \\(\\frac{4}{3}\\pi r^3\\), pyramid = \\(\\frac{1}{3}Bh\\). Surface area is the total area of all faces/surfaces.</p>`,
        keyFormulas:['V_{\\text{cylinder}} = \\pi r^2 h','V_{\\text{cone}} = \\frac{1}{3}\\pi r^2 h','V_{\\text{sphere}} = \\frac{4}{3}\\pi r^3','V_{\\text{prism}} = Bh'],
        videos:[{title:'Volume of Solids',videoId:'hSEoMa-3sLw',channel:'Khan Academy'},{title:'Volume Formulas',videoId:'gPR-pvFPHHo',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Volume of a cylinder with r=3, h=10:',options:['\\(90\\pi\\)','\\(30\\pi\\)','\\(60\\pi\\)','\\(900\\pi\\)'],correct:0,solution:'V = πr²h = π(9)(10) = 90π'},
          {question:'Volume of a sphere with r=6:',options:['\\(288\\pi\\)','\\(144\\pi\\)','\\(36\\pi\\)','\\(864\\pi\\)'],correct:0,solution:'V = (4/3)π(6)³ = (4/3)π(216) = 288π'},
          {question:'A cone has r=4, h=9. Find its volume.',options:['\\(48\\pi\\)','\\(144\\pi\\)','\\(36\\pi\\)','\\(16\\pi\\)'],correct:0,solution:'V = (1/3)π(4)²(9) = (1/3)π(144) = 48π'}
        ]}
    ]}
  ]
},
{
  id:'algebra-2', title:'Algebra 2', icon:'📊', color:'#f59e0b',
  description:'Advance through polynomials, exponentials, logarithms, and complex numbers.',
  units:[
    { id:'a2-u1', title:'Quadratic Functions & Complex Numbers', topics:[
      { id:'a2-u1-t1', title:'Completing the Square',
        explanation:`<p><strong>Completing the square</strong> converts \\(ax^2+bx+c\\) into vertex form \\(a(x-h)^2+k\\). Take half of \\(b\\), square it, and add/subtract to create a perfect square trinomial. This technique is used for solving equations, deriving the quadratic formula, and rewriting conic sections.</p>`,
        keyFormulas:['x^2 + bx + \\left(\\frac{b}{2}\\right)^2 = \\left(x + \\frac{b}{2}\\right)^2','ax^2+bx+c = a\\left(x+\\frac{b}{2a}\\right)^2 + c - \\frac{b^2}{4a}'],
        videos:[{title:'Completing the Square',videoId:'s5FKGEuiMgA',channel:'Khan Academy'},{title:'Completing the Square Method',videoId:'bzJzox_2W8s',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Complete the square: \\(x^2 + 6x + \\_ \\)',options:['9','36','3','12'],correct:0,solution:'(b/2)² = (6/2)² = 9. So x² + 6x + 9 = (x+3)²'},
          {question:'Rewrite \\(x^2-8x+20\\) in vertex form.',options:['\\((x-4)^2+4\\)','\\((x-8)^2+20\\)','\\((x-4)^2-4\\)','\\((x+4)^2+4\\)'],correct:0,solution:'x²-8x+16+4 = (x-4)²+4'},
          {question:'Solve \\(x^2+4x-5=0\\) by completing the square.',options:['\\(x=1\\) or \\(x=-5\\)','\\(x=-1\\) or \\(x=5\\)','\\(x=2\\) or \\(x=-2\\)','\\(x=5\\) or \\(x=-1\\)'],correct:0,solution:'x²+4x = 5 → x²+4x+4 = 9 → (x+2)² = 9 → x+2 = ±3 → x = 1 or -5'}
        ]},
      { id:'a2-u1-t2', title:'Complex Numbers',
        explanation:`<p><strong>Complex numbers</strong> extend the reals with the imaginary unit \\(i = \\sqrt{-1}\\). A complex number has the form \\(a + bi\\) where \\(a\\) is the real part and \\(b\\) is the imaginary part. Add/subtract by combining like parts; multiply using FOIL and \\(i^2 = -1\\).</p>`,
        keyFormulas:['i = \\sqrt{-1}, \\; i^2 = -1','(a+bi)(c+di) = (ac-bd) + (ad+bc)i','|a+bi| = \\sqrt{a^2+b^2}'],
        videos:[{title:'Intro to Complex Numbers',videoId:'ysVcAYo7UPI',channel:'Khan Academy'},{title:'Complex Number Operations',videoId:'SP-YJe7Vldo',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Simplify: \\(\\sqrt{-49}\\)',options:['\\(7i\\)','\\(-7\\)','\\(7\\)','\\(-7i\\)'],correct:0,solution:'√(-49) = √(49)·√(-1) = 7i'},
          {question:'Multiply: \\((3+2i)(1-4i)\\)',options:['\\(11-10i\\)','\\(3-8i\\)','\\(3-10i\\)','\\(11+10i\\)'],correct:0,solution:'3-12i+2i-8i² = 3-10i-8(-1) = 3-10i+8 = 11-10i'},
          {question:'What is \\(i^4\\)?',options:['1','-1','i','-i'],correct:0,solution:'i¹=i, i²=-1, i³=-i, i⁴=1. The powers of i cycle every 4.'}
        ]}
    ]},
    { id:'a2-u2', title:'Polynomial Functions', topics:[
      { id:'a2-u2-t1', title:'Polynomial Operations & Division',
        explanation:`<p>Polynomials of higher degree can be divided using <strong>long division</strong> or <strong>synthetic division</strong> (for dividing by linear factors). The <strong>Remainder Theorem</strong> says \\(f(c)\\) equals the remainder when dividing \\(f(x)\\) by \\((x-c)\\). The <strong>Factor Theorem</strong> says \\((x-c)\\) is a factor if and only if \\(f(c) = 0\\).</p>`,
        keyFormulas:['f(x) = q(x) \\cdot d(x) + r','\\text{Remainder Theorem: } f(c) = \\text{remainder when dividing by } (x-c)','\\text{Factor Theorem: } (x-c) \\text{ is a factor iff } f(c)=0'],
        videos:[{title:'Polynomial Long Division',videoId:'knKCFqPEDfg',channel:'Khan Academy'},{title:'Synthetic Division',videoId:'VYaWf1KRWBM',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Divide \\(x^3-2x^2+x-3\\) by \\((x-1)\\). What is the remainder?',options:['-3','0','1','-1'],correct:0,solution:'By Remainder Theorem: f(1) = 1-2+1-3 = -3'},
          {question:'If \\(f(x) = x^3 - 6x^2 + 11x - 6\\) and \\(f(2) = 0\\), then:',options:['\\((x-2)\\) is a factor','\\((x+2)\\) is a factor','2 is not a root','The degree is 2'],correct:0,solution:'By Factor Theorem, f(2)=0 means (x-2) is a factor.'},
          {question:'What is the degree of \\(3x^4 - x^2 + 7\\)?',options:['4','3','2','7'],correct:0,solution:'The degree is the highest exponent: 4'}
        ]}
    ]},
    { id:'a2-u3', title:'Radical Functions', topics:[
      { id:'a2-u3-t1', title:'Rational Exponents & Radical Equations',
        explanation:`<p><strong>Rational exponents</strong> connect radicals and exponents: \\(a^{1/n} = \\sqrt[n]{a}\\) and \\(a^{m/n} = (\\sqrt[n]{a})^m\\). To solve <strong>radical equations</strong>, isolate the radical, raise both sides to the appropriate power, and always check for extraneous solutions since squaring can introduce false answers.</p>`,
        keyFormulas:['a^{m/n} = \\sqrt[n]{a^m} = (\\sqrt[n]{a})^m','\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}','\\text{Always check for extraneous solutions}'],
        videos:[{title:'Rational Exponents',videoId:'yFaX9bR_e50',channel:'Khan Academy'},{title:'Solving Radical Equations',videoId:'lZKMGBF_ojc',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Simplify: \\(27^{2/3}\\)',options:['9','3','18','27'],correct:0,solution:'27^(1/3) = 3, then 3² = 9'},
          {question:'Solve: \\(\\sqrt{x+5} = 3\\)',options:['\\(x=4\\)','\\(x=14\\)','\\(x=-2\\)','\\(x=9\\)'],correct:0,solution:'Square both sides: x+5 = 9, so x = 4. Check: √(9) = 3 ✓'},
          {question:'Write \\(\\sqrt[4]{x^3}\\) with a rational exponent.',options:['\\(x^{3/4}\\)','\\(x^{4/3}\\)','\\(x^{12}\\)','\\(3x^4\\)'],correct:0,solution:'The fourth root of x³ is x^(3/4)'}
        ]}
    ]},
    { id:'a2-u4', title:'Exponential & Logarithmic Functions', topics:[
      { id:'a2-u4-t1', title:'Exponential Growth & Decay',
        explanation:`<p><strong>Exponential functions</strong> have the form \\(f(x) = a \\cdot b^x\\). When \\(b > 1\\), the function shows growth; when \\(0 < b < 1\\), it shows decay. Exponential growth models population, compound interest, and more. The base \\(e \\approx 2.718\\) is the "natural" base used in continuous growth: \\(A = Pe^{rt}\\).</p>`,
        keyFormulas:['f(x) = a \\cdot b^x','A = P(1 + r)^t \\text{ (compound growth)}','A = Pe^{rt} \\text{ (continuous growth)}','\\text{Half-life: } A = A_0 \\cdot \\left(\\frac{1}{2}\\right)^{t/h}'],
        videos:[{title:'Exponential Growth & Decay',videoId:'lm-FWsOb1Y4',channel:'Khan Academy'},{title:'Exponential Functions',videoId:'EBhmFHayKFg',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'$1000 invested at 5% annual interest compounded yearly for 3 years:',options:['$1157.63','$1150.00','$1050.00','$1500.00'],correct:0,solution:'A = 1000(1.05)³ = 1000(1.157625) ≈ $1157.63'},
          {question:'A population doubles every 4 years, starting at 500. Population after 12 years?',options:['4000','2000','1500','8000'],correct:0,solution:'Doubles 12/4 = 3 times: 500 × 2³ = 500 × 8 = 4000'},
          {question:'Which represents exponential decay?',options:['\\(y = 5(0.8)^x\\)','\\(y = 5(1.2)^x\\)','\\(y = 5x^2\\)','\\(y = 5(2)^x\\)'],correct:0,solution:'Base 0.8 is between 0 and 1, indicating decay.'}
        ]},
      { id:'a2-u4-t2', title:'Logarithms & Properties',
        explanation:`<p>A <strong>logarithm</strong> is the inverse of an exponential: \\(\\log_b(x) = y\\) means \\(b^y = x\\). Key properties: product rule (log of a product = sum of logs), quotient rule, and power rule. The <strong>change of base formula</strong> lets you compute any log using ln or log₁₀.</p>`,
        keyFormulas:['\\log_b(x) = y \\iff b^y = x','\\log_b(mn) = \\log_b m + \\log_b n','\\log_b\\left(\\frac{m}{n}\\right) = \\log_b m - \\log_b n','\\log_b(m^n) = n\\log_b m','\\log_b x = \\frac{\\ln x}{\\ln b}'],
        videos:[{title:'Intro to Logarithms',videoId:'Z5myJ8dg_rM',channel:'Khan Academy'},{title:'Log Properties',videoId:'tzBIyIKLtWE',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Evaluate: \\(\\log_2(32)\\)',options:['5','4','6','3'],correct:0,solution:'2⁵ = 32, so log₂(32) = 5'},
          {question:'Expand: \\(\\log_3(9x^2)\\)',options:['\\(2 + 2\\log_3 x\\)','\\(2\\log_3(9x)\\)','\\(18 + \\log_3 x\\)','\\(\\log_3 9 + \\log_3 x\\)'],correct:0,solution:'log₃(9) + log₃(x²) = 2 + 2log₃(x)'},
          {question:'Solve: \\(\\log x = 3\\)',options:['\\(x=1000\\)','\\(x=30\\)','\\(x=3\\)','\\(x=10\\)'],correct:0,solution:'log means log₁₀, so 10³ = 1000'}
        ]}
    ]},
    { id:'a2-u5', title:'Rational Functions', topics:[
      { id:'a2-u5-t1', title:'Graphing Rational Functions',
        explanation:`<p>A <strong>rational function</strong> is a ratio of polynomials: \\(f(x) = p(x)/q(x)\\). <strong>Vertical asymptotes</strong> occur where the denominator equals zero (and the numerator doesn't). <strong>Horizontal asymptotes</strong> depend on the degree comparison. <strong>Holes</strong> occur when a factor cancels from both numerator and denominator.</p>`,
        keyFormulas:['\\text{VA: set denominator} = 0','\\text{HA: compare degrees of } p(x) \\text{ and } q(x)','\\text{If deg}(p) < \\text{deg}(q): y=0; \\; \\text{equal: } y = \\frac{\\text{leading coefficients}}{}'],
        videos:[{title:'Graphing Rational Functions',videoId:'_qEOZB_fL_0',channel:'Khan Academy'},{title:'Asymptotes of Rational Functions',videoId:'XE-tUMFDCMw',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find the vertical asymptote of \\(f(x) = \\frac{1}{x-3}\\).',options:['\\(x=3\\)','\\(x=-3\\)','\\(y=3\\)','\\(x=0\\)'],correct:0,solution:'Set denominator = 0: x - 3 = 0 → x = 3'},
          {question:'What is the horizontal asymptote of \\(f(x) = \\frac{2x}{x+1}\\)?',options:['\\(y=2\\)','\\(y=0\\)','\\(y=1\\)','None'],correct:0,solution:'Degrees equal: HA = leading coefficients ratio = 2/1 = 2'},
          {question:'Where is the hole in \\(f(x) = \\frac{(x-2)(x+1)}{(x-2)(x+3)}\\)?',options:['\\(x=2\\)','\\(x=-2\\)','\\(x=-1\\)','\\(x=-3\\)'],correct:0,solution:'(x-2) cancels from both, creating a hole at x = 2'}
        ]}
    ]},
    { id:'a2-u6', title:'Sequences & Series', topics:[
      { id:'a2-u6-t1', title:'Arithmetic & Geometric Sequences',
        explanation:`<p>An <strong>arithmetic sequence</strong> has a constant difference \\(d\\) between terms: \\(a_n = a_1 + (n-1)d\\). A <strong>geometric sequence</strong> has a constant ratio \\(r\\): \\(a_n = a_1 \\cdot r^{n-1}\\). For series (sums), arithmetic uses \\(S_n = \\frac{n}{2}(a_1+a_n)\\) and geometric uses \\(S_n = a_1\\frac{1-r^n}{1-r}\\). An infinite geometric series converges when \\(|r| < 1\\).</p>`,
        keyFormulas:['a_n = a_1 + (n-1)d \\text{ (arithmetic)}','a_n = a_1 \\cdot r^{n-1} \\text{ (geometric)}','S_n = \\frac{n}{2}(a_1 + a_n) \\text{ (arithmetic sum)}','S_\\infty = \\frac{a_1}{1-r}, \\; |r|<1 \\text{ (infinite geometric)}'],
        videos:[{title:'Arithmetic Sequences',videoId:'KRFiAlo7t1E',channel:'Khan Academy'},{title:'Geometric Series',videoId:'qjBXQmpP3dg',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find the 10th term: 3, 7, 11, 15, ...',options:['39','43','35','40'],correct:0,solution:'d = 4, a₁₀ = 3 + (10-1)(4) = 3 + 36 = 39'},
          {question:'Find the sum of the infinite series: 8 + 4 + 2 + 1 + ...',options:['16','15','32','∞'],correct:0,solution:'a₁ = 8, r = 1/2. S∞ = 8/(1 - 1/2) = 8/(1/2) = 16'},
          {question:'Find the 5th term of: 2, 6, 18, 54, ...',options:['162','108','216','81'],correct:0,solution:'r = 3, a₅ = 2 · 3⁴ = 2 · 81 = 162'}
        ]}
    ]},
    { id:'a2-u7', title:'Probability & Statistics', topics:[
      { id:'a2-u7-t1', title:'Permutations, Combinations & Probability',
        explanation:`<p><strong>Permutations</strong> count ordered arrangements: \\(P(n,r) = \\frac{n!}{(n-r)!}\\). <strong>Combinations</strong> count unordered selections: \\(C(n,r) = \\frac{n!}{r!(n-r)!}\\). <strong>Probability</strong> of an event is favorable outcomes over total outcomes. Complementary probability: \\(P(A') = 1 - P(A)\\).</p>`,
        keyFormulas:['P(n,r) = \\frac{n!}{(n-r)!}','C(n,r) = \\binom{n}{r} = \\frac{n!}{r!(n-r)!}','P(A) = \\frac{\\text{favorable}}{\\text{total}}','P(A \\cup B) = P(A) + P(B) - P(A \\cap B)'],
        videos:[{title:'Permutations & Combinations',videoId:'XqQTXW7XfYA',channel:'Khan Academy'},{title:'Probability',videoId:'8TIben0bJpU',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'How many ways can 5 people line up in a row?',options:['120','25','10','60'],correct:0,solution:'5! = 5×4×3×2×1 = 120'},
          {question:'\\(\\binom{8}{3} = \\)',options:['56','336','24','512'],correct:0,solution:'8!/(3!·5!) = (8×7×6)/(3×2×1) = 336/6 = 56'},
          {question:'Probability of drawing a red card from a standard deck?',options:['\\(\\frac{1}{2}\\)','\\(\\frac{1}{4}\\)','\\(\\frac{1}{13}\\)','\\(\\frac{1}{26}\\)'],correct:0,solution:'26 red cards out of 52: 26/52 = 1/2'}
        ]}
    ]}
  ]
},
{
  id:'precalculus', title:'Precalculus', icon:'📈', color:'#10b981',
  description:'Bridge algebra and calculus with advanced functions, trigonometry, and limits.',
  units:[
    { id:'pc-u1', title:'Functions & Transformations', topics:[
      { id:'pc-u1-t1', title:'Function Transformations',
        explanation:`<p><strong>Transformations</strong> modify the graph of a parent function. Vertical shifts: \\(f(x)+k\\) (up) or \\(f(x)-k\\) (down). Horizontal shifts: \\(f(x-h)\\) (right) or \\(f(x+h)\\) (left). Reflections: \\(-f(x)\\) over x-axis, \\(f(-x)\\) over y-axis. Stretches/compressions: \\(af(x)\\) vertical, \\(f(bx)\\) horizontal.</p>`,
        keyFormulas:['y = af(b(x-h)) + k','\\text{Vertical shift: } +k \\text{ up, } -k \\text{ down}','\\text{Horizontal shift: } (x-h) \\text{ moves right } h'],
        videos:[{title:'Function Transformations',videoId:'xezEOBamjRk',channel:'Khan Academy'},{title:'Graph Transformations',videoId:'HXGE-RfPJB8',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'How does \\(f(x-3)+2\\) transform \\(f(x)\\)?',options:['Right 3, up 2','Left 3, up 2','Right 3, down 2','Left 3, down 2'],correct:0,solution:'(x-3) shifts right 3, +2 shifts up 2'},
          {question:'Which transformation reflects over the x-axis?',options:['\\(-f(x)\\)','\\(f(-x)\\)','\\(f(x-1)\\)','\\(|f(x)|\\)'],correct:0,solution:'-f(x) negates all y-values, reflecting over the x-axis.'},
          {question:'\\(f(2x)\\) does what to the graph?',options:['Compresses horizontally by factor 2','Stretches horizontally by factor 2','Stretches vertically by factor 2','Shifts right 2'],correct:0,solution:'f(bx) with b > 1 compresses horizontally by factor b.'}
        ]},
      { id:'pc-u1-t2', title:'Inverse Functions',
        explanation:`<p>The <strong>inverse function</strong> \\(f^{-1}\\) reverses \\(f\\): if \\(f(a)=b\\), then \\(f^{-1}(b)=a\\). To find it, swap \\(x\\) and \\(y\\) in the equation and solve for \\(y\\). Graphically, \\(f^{-1}\\) is the reflection of \\(f\\) over the line \\(y=x\\). A function has an inverse only if it is <strong>one-to-one</strong> (passes the horizontal line test).</p>`,
        keyFormulas:['f(f^{-1}(x)) = f^{-1}(f(x)) = x','\\text{Swap } x \\text{ and } y, \\text{ solve for } y','\\text{Domain of } f = \\text{Range of } f^{-1}'],
        videos:[{title:'Inverse Functions',videoId:'2X3F89t97ic',channel:'Khan Academy'},{title:'Finding Inverse Functions',videoId:'2nFSMcGBSLA',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find \\(f^{-1}(x)\\) if \\(f(x) = 2x + 3\\).',options:['\\(\\frac{x-3}{2}\\)','\\(\\frac{x+3}{2}\\)','\\(2x-3\\)','\\(\\frac{1}{2x+3}\\)'],correct:0,solution:'y = 2x+3 → x = 2y+3 → y = (x-3)/2'},
          {question:'If \\(f(5) = 12\\), then \\(f^{-1}(12) =\\)',options:['5','12','\\(\\frac{1}{12}\\)','\\(\\frac{5}{12}\\)'],correct:0,solution:'The inverse reverses the mapping: f⁻¹(12) = 5'},
          {question:'Which test determines if a function has an inverse?',options:['Horizontal line test','Vertical line test','Symmetry test','Origin test'],correct:0,solution:'A function is one-to-one (has an inverse) if it passes the horizontal line test.'}
        ]}
    ]},
    { id:'pc-u2', title:'Trigonometric Functions', topics:[
      { id:'pc-u2-t1', title:'Unit Circle & Radian Measure',
        explanation:`<p>The <strong>unit circle</strong> is a circle with radius 1 centered at the origin. Any angle \\(\\theta\\) corresponds to a point \\((\\cos\\theta, \\sin\\theta)\\) on the unit circle. <strong>Radians</strong> measure angles using arc length: \\(\\pi\\) radians = 180°. Key angles: 0, π/6, π/4, π/3, π/2, and their multiples.</p>`,
        keyFormulas:['\\text{Degrees to radians: } \\theta_{rad} = \\theta° \\cdot \\frac{\\pi}{180}','(\\cos\\theta, \\sin\\theta) \\text{ on unit circle}','\\sin^2\\theta + \\cos^2\\theta = 1'],
        videos:[{title:'Unit Circle',videoId:'1m9p9iubMLU',channel:'Khan Academy'},{title:'Radians and Degrees',videoId:'qp1ND5KXHOQ',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Convert 120° to radians.',options:['\\(\\frac{2\\pi}{3}\\)','\\(\\frac{\\pi}{3}\\)','\\(\\frac{3\\pi}{4}\\)','\\(\\frac{\\pi}{2}\\)'],correct:0,solution:'120 × π/180 = 2π/3'},
          {question:'\\(\\cos(\\pi/3) = \\)',options:['\\(\\frac{1}{2}\\)','\\(\\frac{\\sqrt{3}}{2}\\)','\\(\\frac{\\sqrt{2}}{2}\\)','0'],correct:0,solution:'On the unit circle, cos(60°) = cos(π/3) = 1/2'},
          {question:'\\(\\sin(3\\pi/2) = \\)',options:['-1','0','1','\\(\\frac{1}{2}\\)'],correct:0,solution:'3π/2 = 270°, point (0, -1), so sin = -1'}
        ]},
      { id:'pc-u2-t2', title:'Graphs of Sine & Cosine',
        explanation:`<p>The general sinusoidal function is \\(y = A\\sin(B(x-C))+D\\) where \\(|A|\\) is <strong>amplitude</strong>, \\(\\frac{2\\pi}{|B|}\\) is <strong>period</strong>, \\(C\\) is <strong>phase shift</strong>, and \\(D\\) is <strong>vertical shift</strong>. Sine starts at the midline; cosine starts at its maximum.</p>`,
        keyFormulas:['y = A\\sin(B(x - C)) + D','\\text{Amplitude} = |A|, \\; \\text{Period} = \\frac{2\\pi}{|B|}','\\text{Phase shift} = C, \\; \\text{Vertical shift} = D'],
        videos:[{title:'Graphing Sine & Cosine',videoId:'x5z4JHMi7Gc',channel:'Khan Academy'},{title:'Sinusoidal Functions',videoId:'GJx_dZyG9jM',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find the amplitude and period of \\(y = 3\\sin(2x)\\).',options:['A=3, P=π','A=3, P=2π','A=2, P=3π','A=6, P=π'],correct:0,solution:'Amplitude = |3| = 3, Period = 2π/|2| = π'},
          {question:'What is the period of \\(y = \\cos(\\frac{x}{3})\\)?',options:['\\(6\\pi\\)','\\(\\frac{2\\pi}{3}\\)','\\(3\\pi\\)','\\(2\\pi\\)'],correct:0,solution:'B = 1/3, Period = 2π/(1/3) = 6π'},
          {question:'The phase shift of \\(y = \\sin(x - \\pi/4)\\) is:',options:['\\(\\pi/4\\) right','\\(\\pi/4\\) left','\\(\\pi\\) right','No shift'],correct:0,solution:'(x - π/4) means shift right by π/4'}
        ]}
    ]},
    { id:'pc-u3', title:'Analytic Trigonometry', topics:[
      { id:'pc-u3-t1', title:'Trigonometric Identities',
        explanation:`<p><strong>Trig identities</strong> are equations true for all valid angles. The fundamental identity is \\(\\sin^2\\theta + \\cos^2\\theta = 1\\). Derived identities include \\(\\tan^2\\theta + 1 = \\sec^2\\theta\\) and \\(1 + \\cot^2\\theta = \\csc^2\\theta\\). Use these to simplify expressions and prove other identities.</p>`,
        keyFormulas:['\\sin^2\\theta + \\cos^2\\theta = 1','\\tan^2\\theta + 1 = \\sec^2\\theta','1 + \\cot^2\\theta = \\csc^2\\theta','\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}'],
        videos:[{title:'Trig Identities',videoId:'k_wJsio68D4',channel:'Khan Academy'},{title:'Proving Trig Identities',videoId:'_LqCVLeHkD0',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Simplify: \\(\\sin^2 x + \\cos^2 x\\)',options:['1','0','\\(2\\sin x\\cos x\\)','\\(\\sin 2x\\)'],correct:0,solution:'This is the Pythagorean identity: sin²x + cos²x = 1'},
          {question:'Simplify: \\(\\sec^2\\theta - \\tan^2\\theta\\)',options:['1','0','\\(\\cos^2\\theta\\)','\\(\\sin^2\\theta\\)'],correct:0,solution:'From tan²θ + 1 = sec²θ, so sec²θ - tan²θ = 1'},
          {question:'Express \\(\\frac{\\sin\\theta}{\\cos\\theta}\\) as a single function.',options:['\\(\\tan\\theta\\)','\\(\\cot\\theta\\)','\\(\\sec\\theta\\)','\\(\\csc\\theta\\)'],correct:0,solution:'sin/cos = tan by definition'}
        ]},
      { id:'pc-u3-t2', title:'Sum, Difference & Double-Angle Formulas',
        explanation:`<p><strong>Sum/difference formulas</strong> find trig values of combined angles. The <strong>double-angle formulas</strong> are special cases for \\(2\\theta\\). These are essential for simplifying expressions, solving equations, and integrating trig functions in calculus.</p>`,
        keyFormulas:['\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B','\\cos(A \\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B','\\sin 2\\theta = 2\\sin\\theta\\cos\\theta','\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta'],
        videos:[{title:'Sum & Difference Formulas',videoId:'hjigR_rHKDI',channel:'Khan Academy'},{title:'Double Angle Formulas',videoId:'Xb1rwWoYjnQ',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find \\(\\sin 75°\\) using sum formula (45° + 30°).',options:['\\(\\frac{\\sqrt{6}+\\sqrt{2}}{4}\\)','\\(\\frac{\\sqrt{3}+1}{4}\\)','\\(\\frac{\\sqrt{2}}{2}\\)','\\(\\frac{1}{2}\\)'],correct:0,solution:'sin(45°+30°) = sin45·cos30 + cos45·sin30 = (√2/2)(√3/2) + (√2/2)(1/2) = (√6+√2)/4'},
          {question:'If \\(\\sin\\theta = 3/5\\) (Q1), find \\(\\sin 2\\theta\\).',options:['\\(24/25\\)','\\(6/5\\)','\\(9/25\\)','\\(12/25\\)'],correct:0,solution:'cosθ = 4/5, sin2θ = 2(3/5)(4/5) = 24/25'},
          {question:'\\(\\cos 2\\theta\\) can be written as:',options:['All of these','\\(1-2\\sin^2\\theta\\)','\\(2\\cos^2\\theta-1\\)','\\(\\cos^2\\theta-\\sin^2\\theta\\)'],correct:0,solution:'cos2θ has three equivalent forms: cos²θ-sin²θ = 1-2sin²θ = 2cos²θ-1'}
        ]}
    ]},
    { id:'pc-u4', title:'Vectors & Polar Coordinates', topics:[
      { id:'pc-u4-t1', title:'Vectors in Two Dimensions',
        explanation:`<p>A <strong>vector</strong> has both magnitude and direction, written as \\(\\vec{v} = \\langle a, b \\rangle\\). The <strong>magnitude</strong> is \\(|\\vec{v}| = \\sqrt{a^2+b^2}\\). Vectors can be added component-wise and scaled by scalars. The <strong>dot product</strong> \\(\\vec{u} \\cdot \\vec{v} = u_1v_1 + u_2v_2\\) measures how aligned two vectors are.</p>`,
        keyFormulas:['|\\vec{v}| = \\sqrt{a^2 + b^2}','\\vec{u} \\cdot \\vec{v} = u_1v_1 + u_2v_2 = |\\vec{u}||\\vec{v}|\\cos\\theta','\\vec{u} + \\vec{v} = \\langle u_1+v_1, u_2+v_2 \\rangle'],
        videos:[{title:'Intro to Vectors',videoId:'br7tS1t2SFE',channel:'Khan Academy'},{title:'Vector Operations',videoId:'WNuIhXo39_k',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find the magnitude of \\(\\vec{v} = \\langle 3, 4 \\rangle\\).',options:['5','7','\\(\\sqrt{7}\\)','25'],correct:0,solution:'|v| = √(9+16) = √25 = 5'},
          {question:'\\(\\langle 2,3 \\rangle + \\langle -1,5 \\rangle = \\)',options:['\\(\\langle 1,8 \\rangle\\)','\\(\\langle 3,8 \\rangle\\)','\\(\\langle 1,2 \\rangle\\)','\\(\\langle -2,15 \\rangle\\)'],correct:0,solution:'Add components: (2+(-1), 3+5) = (1, 8)'},
          {question:'\\(\\langle 1,2 \\rangle \\cdot \\langle 3,-1 \\rangle = \\)',options:['1','5','-1','7'],correct:0,solution:'1(3) + 2(-1) = 3 - 2 = 1'}
        ]}
    ]},
    { id:'pc-u5', title:'Conic Sections', topics:[
      { id:'pc-u5-t1', title:'Parabolas, Ellipses & Hyperbolas',
        explanation:`<p><strong>Conic sections</strong> are curves from slicing a cone. A <strong>parabola</strong> has one focus: \\((x-h)^2 = 4p(y-k)\\). An <strong>ellipse</strong> has two foci: \\(\\frac{(x-h)^2}{a^2}+\\frac{(y-k)^2}{b^2}=1\\). A <strong>hyperbola</strong> has two branches: \\(\\frac{(x-h)^2}{a^2}-\\frac{(y-k)^2}{b^2}=1\\). Each has distinct geometric properties involving foci, vertices, and asymptotes.</p>`,
        keyFormulas:['\\frac{(x-h)^2}{a^2} + \\frac{(y-k)^2}{b^2} = 1 \\text{ (ellipse)}','\\frac{(x-h)^2}{a^2} - \\frac{(y-k)^2}{b^2} = 1 \\text{ (hyperbola)}','c^2 = a^2 - b^2 \\text{ (ellipse)}, \\; c^2 = a^2 + b^2 \\text{ (hyperbola)}'],
        videos:[{title:'Conic Sections Overview',videoId:'lvAYFUIEpFI',channel:'Khan Academy'},{title:'Ellipses & Hyperbolas',videoId:'pzSyOGksgk4',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Identify: \\(\\frac{x^2}{9}+\\frac{y^2}{4}=1\\)',options:['Ellipse','Hyperbola','Circle','Parabola'],correct:0,solution:'Both terms positive with different denominators → ellipse'},
          {question:'Find the foci of \\(\\frac{x^2}{25}+\\frac{y^2}{9}=1\\).',options:['\\((\\pm 4, 0)\\)','\\((\\pm 5, 0)\\)','\\((0, \\pm 4)\\)','\\((\\pm 3, 0)\\)'],correct:0,solution:'c² = a²-b² = 25-9 = 16, c = 4. Foci at (±4, 0)'},
          {question:'A hyperbola \\(\\frac{x^2}{16}-\\frac{y^2}{9}=1\\) opens:',options:['Left and right','Up and down','All directions','Along y-axis'],correct:0,solution:'x²-term is positive, so it opens left and right (horizontal transverse axis).'}
        ]}
    ]},
    { id:'pc-u6', title:'Introduction to Limits', topics:[
      { id:'pc-u6-t1', title:'Understanding Limits',
        explanation:`<p>A <strong>limit</strong> describes the value a function approaches as the input approaches some value. We write \\(\\lim_{x \\to c} f(x) = L\\). Limits can be evaluated by direct substitution, factoring, rationalizing, or using special limit theorems. The limit may exist even when the function is undefined at that point.</p>`,
        keyFormulas:['\\lim_{x \\to c} f(x) = L','\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1','\\text{If direct substitution gives } \\frac{0}{0}, \\text{ try factoring or rationalizing}'],
        videos:[{title:'Intro to Limits',videoId:'riXcZT2ICjA',channel:'Khan Academy'},{title:'Evaluating Limits',videoId:'YNstlN1YRHA',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'\\(\\lim_{x \\to 3} (2x + 1) = \\)',options:['7','6','5','9'],correct:0,solution:'Direct substitution: 2(3) + 1 = 7'},
          {question:'\\(\\lim_{x \\to 2} \\frac{x^2-4}{x-2} = \\)',options:['4','0','Undefined','2'],correct:0,solution:'Factor: (x-2)(x+2)/(x-2) = x+2. At x=2: 4'},
          {question:'\\(\\lim_{x \\to 0} \\frac{\\sin x}{x} = \\)',options:['1','0','∞','Undefined'],correct:0,solution:'This is a fundamental limit that equals 1.'}
        ]}
    ]}
  ]
},
{
  id:'calculus-ab', title:'AP Calculus AB', icon:'∫', color:'#3b82f6',
  description:'Master limits, derivatives, integrals, and their applications.',
  units:[
    { id:'cab-u1', title:'Limits & Continuity', topics:[
      { id:'cab-u1-t1', title:'Limit Laws & Evaluation',
        explanation:`<p><strong>Limit laws</strong> let you break complex limits into simpler pieces: sum, difference, product, quotient, and power rules. When direct substitution yields \\(\\frac{0}{0}\\) (indeterminate form), try factoring, rationalizing, or multiplying by a conjugate. One-sided limits (\\(\\lim_{x\\to c^+}\\) and \\(\\lim_{x\\to c^-}\\)) must agree for the two-sided limit to exist.</p>`,
        keyFormulas:['\\lim_{x\\to c}[f(x) \\pm g(x)] = \\lim f(x) \\pm \\lim g(x)','\\lim_{x\\to c}[f(x) \\cdot g(x)] = \\lim f(x) \\cdot \\lim g(x)','\\lim_{x\\to c} \\frac{f(x)}{g(x)} = \\frac{\\lim f(x)}{\\lim g(x)}, \\; \\lim g(x) \\neq 0'],
        videos:[{title:'Limit Laws',videoId:'lSwsAFgWqR8',channel:'Khan Academy'},{title:'Evaluating Limits Algebraically',videoId:'aLehpBbNmBk',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'\\(\\lim_{x\\to 1} \\frac{x^2 - 1}{x - 1} = \\)',options:['2','0','1','Undefined'],correct:0,solution:'Factor: (x-1)(x+1)/(x-1) = x+1. At x=1: 2'},
          {question:'\\(\\lim_{x\\to 4} \\frac{\\sqrt{x}-2}{x-4} = \\)',options:['\\(\\frac{1}{4}\\)','0','\\(\\frac{1}{2}\\)','Undefined'],correct:0,solution:'Rationalize: multiply by (√x+2)/(√x+2) → 1/(√x+2). At x=4: 1/4'},
          {question:'If \\(\\lim_{x\\to 2^-} f(x) = 3\\) and \\(\\lim_{x\\to 2^+} f(x) = 5\\), then \\(\\lim_{x\\to 2} f(x)\\):',options:['Does not exist','Equals 3','Equals 5','Equals 4'],correct:0,solution:'Left and right limits differ, so the two-sided limit does not exist.'}
        ]},
      { id:'cab-u1-t2', title:'Continuity & Squeeze Theorem',
        explanation:`<p>A function is <strong>continuous</strong> at \\(x=c\\) if: (1) \\(f(c)\\) exists, (2) \\(\\lim_{x\\to c} f(x)\\) exists, and (3) \\(\\lim_{x\\to c} f(x) = f(c)\\). The <strong>Squeeze Theorem</strong> says if \\(g(x) \\leq f(x) \\leq h(x)\\) near \\(c\\) and \\(\\lim g(x) = \\lim h(x) = L\\), then \\(\\lim f(x) = L\\). The <strong>IVT</strong> guarantees intermediate values for continuous functions.</p>`,
        keyFormulas:['\\text{Continuous at } c: \\lim_{x\\to c} f(x) = f(c)','\\text{Squeeze: } g(x) \\leq f(x) \\leq h(x), \\; \\lim g = \\lim h = L \\Rightarrow \\lim f = L','\\text{IVT: If } f \\text{ is continuous on } [a,b], f \\text{ takes every value between } f(a) \\text{ and } f(b)'],
        videos:[{title:'Continuity',videoId:'joewRl1CTL8',channel:'Khan Academy'},{title:'Squeeze Theorem',videoId:'bxe2T-V8XRs',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Is \\(f(x)=\\frac{x^2-4}{x-2}\\) continuous at \\(x=2\\)?',options:['No','Yes','Only from left','Only from right'],correct:0,solution:'f(2) is undefined (0/0), so f is not continuous at x = 2.'},
          {question:'If \\(-x^2 \\leq x^2\\sin(1/x) \\leq x^2\\) near 0, find \\(\\lim_{x\\to 0} x^2\\sin(1/x)\\).',options:['0','1','-1','DNE'],correct:0,solution:'Both bounds → 0, so by Squeeze Theorem, the limit = 0'},
          {question:'If \\(f\\) is continuous on [1,5] with \\(f(1)=-2\\) and \\(f(5)=4\\), IVT guarantees a root in:',options:['(1, 5)','[0, 1]','(5, ∞)','Cannot determine'],correct:0,solution:'f changes sign from -2 to 4, so by IVT, there exists c in (1,5) where f(c) = 0.'}
        ]}
    ]},
    { id:'cab-u2', title:'Differentiation: Definition & Basic Rules', topics:[
      { id:'cab-u2-t1', title:'Definition of the Derivative',
        explanation:`<p>The <strong>derivative</strong> measures the instantaneous rate of change. Defined as \\(f'(x) = \\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}\\). Geometrically, it gives the slope of the tangent line at a point. The derivative exists only where the function is smooth — not at corners, cusps, or discontinuities.</p>`,
        keyFormulas:["f'(x) = \\lim_{h\\to 0} \\frac{f(x+h) - f(x)}{h}","f'(a) = \\lim_{x\\to a} \\frac{f(x) - f(a)}{x - a}",'\\text{Tangent line: } y - f(a) = f\'(a)(x - a)'],
        videos:[{title:'Definition of Derivative',videoId:'ANyVpMS3HL4',channel:'Khan Academy'},{title:'Derivative from First Principles',videoId:'HPRGdb8T0QI',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find \\(f\'(x)\\) from the limit definition for \\(f(x) = x^2\\).',options:['\\(2x\\)','\\(x^2\\)','\\(2\\)','\\(x\\)'],correct:0,solution:'lim[(x+h)²-x²]/h = lim[2xh+h²]/h = lim(2x+h) = 2x'},
          {question:'What does \\(f\'(3) = 5\\) mean geometrically?',options:['Tangent line at x=3 has slope 5','f(3) = 5','Area under curve is 5','f has 5 roots'],correct:0,solution:"The derivative at a point gives the slope of the tangent line there."},
          {question:'At which point is \\(f(x) = |x|\\) not differentiable?',options:['\\(x=0\\)','\\(x=1\\)','\\(x=-1\\)','It is differentiable everywhere'],correct:0,solution:'|x| has a corner (sharp turn) at x = 0, so the derivative does not exist there.'}
        ]},
      { id:'cab-u2-t2', title:'Power, Product & Quotient Rules',
        explanation:`<p>The <strong>power rule</strong> \\(\\frac{d}{dx}x^n = nx^{n-1}\\) handles any power. The <strong>product rule</strong> differentiates products: \\((fg)' = f'g + fg'\\). The <strong>quotient rule</strong> handles fractions: \\(\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}\\). These rules, combined with derivatives of trig functions, let you differentiate almost any function.</p>`,
        keyFormulas:['\\frac{d}{dx}x^n = nx^{n-1}','(fg)\' = f\'g + fg\'','\\left(\\frac{f}{g}\\right)\' = \\frac{f\'g - fg\'}{g^2}','\\frac{d}{dx}\\sin x = \\cos x, \\; \\frac{d}{dx}\\cos x = -\\sin x'],
        videos:[{title:'Power Rule',videoId:'H-v4oraDjuM',channel:'Khan Academy'},{title:'Product & Quotient Rules',videoId:'HaGbRBELBIw',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'\\(\\frac{d}{dx}(3x^4 - 2x + 7) = \\)',options:['\\(12x^3 - 2\\)','\\(12x^3 - 2x\\)','\\(3x^3 - 2\\)','\\(12x^4 - 2\\)'],correct:0,solution:'Power rule: 3(4x³) - 2(1) + 0 = 12x³ - 2'},
          {question:'Find \\(\\frac{d}{dx}[x^2 \\sin x]\\).',options:['\\(2x\\sin x + x^2\\cos x\\)','\\(2x\\cos x\\)','\\(x^2\\cos x\\)','\\(2x\\sin x\\)'],correct:0,solution:'Product rule: (2x)(sinx) + (x²)(cosx)'},
          {question:'Find \\(\\frac{d}{dx}\\frac{x}{x+1}\\).',options:['\\(\\frac{1}{(x+1)^2}\\)','\\(\\frac{1}{x+1}\\)','\\(\\frac{x}{(x+1)^2}\\)','\\(\\frac{-1}{(x+1)^2}\\)'],correct:0,solution:'Quotient rule: [(1)(x+1) - (x)(1)]/(x+1)² = 1/(x+1)²'}
        ]}
    ]},
    { id:'cab-u3', title:'Chain Rule & Implicit Differentiation', topics:[
      { id:'cab-u3-t1', title:'Chain Rule',
        explanation:`<p>The <strong>chain rule</strong> differentiates composite functions: if \\(y = f(g(x))\\), then \\(y' = f'(g(x)) \\cdot g'(x)\\). Think "derivative of the outside times derivative of the inside." This is the most important differentiation rule for complex functions.</p>`,
        keyFormulas:['\\frac{d}{dx}f(g(x)) = f\'(g(x)) \\cdot g\'(x)','\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}','\\frac{d}{dx}[f(x)]^n = n[f(x)]^{n-1} \\cdot f\'(x)'],
        videos:[{title:'Chain Rule',videoId:'0T0QrHO56qg',channel:'Khan Academy'},{title:'Chain Rule Examples',videoId:'HaHsqDjWMLo',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'\\(\\frac{d}{dx}(3x+1)^5 = \\)',options:['\\(15(3x+1)^4\\)','\\(5(3x+1)^4\\)','\\(15(3x)^4\\)','\\((3x+1)^4\\)'],correct:0,solution:'5(3x+1)⁴ · 3 = 15(3x+1)⁴'},
          {question:'\\(\\frac{d}{dx}\\sin(x^2) = \\)',options:['\\(2x\\cos(x^2)\\)','\\(\\cos(x^2)\\)','\\(2x\\sin(x^2)\\)','\\(x^2\\cos(x^2)\\)'],correct:0,solution:'cos(x²) · 2x = 2x cos(x²)'},
          {question:'\\(\\frac{d}{dx}e^{3x} = \\)',options:['\\(3e^{3x}\\)','\\(e^{3x}\\)','\\(3xe^{3x}\\)','\\(e^{3x}/3\\)'],correct:0,solution:'e^(3x) · 3 = 3e^(3x)'}
        ]},
      { id:'cab-u3-t2', title:'Implicit Differentiation',
        explanation:`<p><strong>Implicit differentiation</strong> finds \\(dy/dx\\) when \\(y\\) is not explicitly solved as a function of \\(x\\). Differentiate both sides with respect to \\(x\\), applying the chain rule to \\(y\\) terms (each gets a \\(dy/dx\\) factor), then solve for \\(dy/dx\\).</p>`,
        keyFormulas:['\\frac{d}{dx}[y^n] = ny^{n-1}\\frac{dy}{dx}','\\frac{d}{dx}[xy] = y + x\\frac{dy}{dx}','\\text{Differentiate both sides, solve for } \\frac{dy}{dx}'],
        videos:[{title:'Implicit Differentiation',videoId:'qb40J4N1fa4',channel:'Khan Academy'},{title:'Implicit Differentiation Examples',videoId:'LGY-DjFsALc',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find \\(dy/dx\\) for \\(x^2 + y^2 = 25\\).',options:['\\(-x/y\\)','\\(x/y\\)','\\(-y/x\\)','\\(2x+2y\\)'],correct:0,solution:'2x + 2y(dy/dx) = 0 → dy/dx = -x/y'},
          {question:'Find \\(dy/dx\\) for \\(xy = 6\\).',options:['\\(-y/x\\)','\\(y/x\\)','\\(6/x^2\\)','\\(-6/x\\)'],correct:0,solution:'Product rule: y + x(dy/dx) = 0 → dy/dx = -y/x'},
          {question:'Find \\(dy/dx\\) for \\(x^3 + y^3 = 9\\).',options:['\\(-x^2/y^2\\)','\\(x^2/y^2\\)','\\(-3x^2\\)','\\(3y^2\\)'],correct:0,solution:'3x² + 3y²(dy/dx) = 0 → dy/dx = -x²/y²'}
        ]}
    ]},
    { id:'cab-u4', title:'Applications of Differentiation', topics:[
      { id:'cab-u4-t1', title:'Related Rates',
        explanation:`<p><strong>Related rates</strong> problems involve finding the rate of change of one quantity using the known rate of another. Strategy: identify variables, write an equation relating them, differentiate with respect to time \\(t\\) (using the chain rule), then substitute known values and solve.</p>`,
        keyFormulas:['\\text{Differentiate the geometric/physical relationship with respect to } t','\\frac{d}{dt}[V] = \\frac{dV}{dr} \\cdot \\frac{dr}{dt}','A = \\pi r^2 \\Rightarrow \\frac{dA}{dt} = 2\\pi r \\frac{dr}{dt}'],
        videos:[{title:'Related Rates',videoId:'ps-r1rqBKjA',channel:'Khan Academy'},{title:'Related Rates Problems',videoId:'I9mVUo-bhM8',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:"A circle's radius grows at 2 cm/s. How fast is the area growing when r = 5?",options:['\\(20\\pi\\) cm²/s','\\(10\\pi\\) cm²/s','\\(50\\pi\\) cm²/s','\\(25\\pi\\) cm²/s'],correct:0,solution:'dA/dt = 2πr·(dr/dt) = 2π(5)(2) = 20π'},
          {question:'A 10-ft ladder slides down a wall. If the base moves at 1 ft/s and is 6 ft from the wall, how fast does the top slide?',options:['\\(-3/4\\) ft/s','\\(3/4\\) ft/s','\\(-1\\) ft/s','\\(1\\) ft/s'],correct:0,solution:'x²+y²=100. 2x(dx/dt)+2y(dy/dt)=0. y=8, so 12(1)+16(dy/dt)=0 → dy/dt = -3/4'},
          {question:"A sphere's volume increases at 10 cm³/s. Find dr/dt when r = 2.",options:['\\(\\frac{5}{8\\pi}\\)','\\(\\frac{10}{16\\pi}\\)','\\(\\frac{5}{4\\pi}\\)','\\(\\frac{1}{\\pi}\\)'],correct:0,solution:'dV/dt = 4πr²(dr/dt). 10 = 4π(4)(dr/dt) → dr/dt = 10/(16π) = 5/(8π)'}
        ]},
      { id:'cab-u4-t2', title:'Optimization & Mean Value Theorem',
        explanation:`<p><strong>Optimization</strong> uses derivatives to find maximum and minimum values. Find critical points where \\(f'(x) = 0\\) or undefined, then use the first or second derivative test. The <strong>Mean Value Theorem</strong> states that if \\(f\\) is continuous on \\([a,b]\\) and differentiable on \\((a,b)\\), there exists \\(c\\) where \\(f'(c) = \\frac{f(b)-f(a)}{b-a}\\).</p>`,
        keyFormulas:["\\text{Critical points: } f'(x) = 0 \\text{ or undefined}","\\text{2nd Derivative Test: } f''(c) > 0 \\Rightarrow \\text{local min}, \\; f''(c) < 0 \\Rightarrow \\text{local max}","\\text{MVT: } f'(c) = \\frac{f(b)-f(a)}{b-a}"],
        videos:[{title:'Optimization Problems',videoId:'lDY9JcFaRd4',channel:'Khan Academy'},{title:'Mean Value Theorem',videoId:'lx8RcYcYVuU',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find the critical points of \\(f(x) = x^3 - 3x\\).',options:['\\(x = \\pm 1\\)','\\(x = 0\\)','\\(x = 3\\)','\\(x = \\pm 3\\)'],correct:0,solution:"f'(x) = 3x² - 3 = 0 → x² = 1 → x = ±1"},
          {question:'For \\(f(x) = x^2\\) on [1, 3], find c satisfying MVT.',options:['2','1.5','2.5','3'],correct:0,solution:"f'(c) = (9-1)/(3-1) = 4. f'(x) = 2x → 2c = 4 → c = 2"},
          {question:'\\(f\'\'(2) > 0\\) and \\(f\'(2) = 0\\) means \\(x = 2\\) is a:',options:['Local minimum','Local maximum','Inflection point','Saddle point'],correct:0,solution:"f'(2) = 0 (critical point) and f''(2) > 0 (concave up) → local minimum"}
        ]}
    ]},
    { id:'cab-u5', title:'Integration', topics:[
      { id:'cab-u5-t1', title:'Antiderivatives & Fundamental Theorem',
        explanation:`<p>An <strong>antiderivative</strong> of \\(f(x)\\) is a function \\(F(x)\\) where \\(F'(x) = f(x)\\). The <strong>Fundamental Theorem of Calculus</strong> connects derivatives and integrals: Part 1 says \\(\\frac{d}{dx}\\int_a^x f(t)\\,dt = f(x)\\); Part 2 says \\(\\int_a^b f(x)\\,dx = F(b) - F(a)\\). This is the most important theorem in calculus.</p>`,
        keyFormulas:['\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C, \\; n \\neq -1','\\int_a^b f(x)\\,dx = F(b) - F(a)','\\frac{d}{dx}\\int_a^x f(t)\\,dt = f(x)','\\int \\sin x\\,dx = -\\cos x + C, \\; \\int \\cos x\\,dx = \\sin x + C'],
        videos:[{title:'Antiderivatives',videoId:'rfG8ce4nNh0',channel:'Khan Academy'},{title:'Fundamental Theorem of Calculus',videoId:'4Tlw-GUFBMA',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'\\(\\int 4x^3\\,dx = \\)',options:['\\(x^4 + C\\)','\\(12x^2 + C\\)','\\(4x^4 + C\\)','\\(x^3 + C\\)'],correct:0,solution:'4 · x⁴/4 + C = x⁴ + C'},
          {question:'\\(\\int_0^2 3x^2\\,dx = \\)',options:['8','6','12','4'],correct:0,solution:'[x³]₀² = 2³ - 0³ = 8'},
          {question:'\\(\\frac{d}{dx}\\int_1^x \\sqrt{t}\\,dt = \\)',options:['\\(\\sqrt{x}\\)','\\(\\frac{2}{3}x^{3/2}\\)','\\(\\frac{1}{2\\sqrt{x}}\\)','0'],correct:0,solution:'By FTC Part 1: d/dx ∫₁ˣ √t dt = √x'}
        ]},
      { id:'cab-u5-t2', title:'U-Substitution',
        explanation:`<p><strong>U-substitution</strong> is the integration counterpart of the chain rule. Choose \\(u = g(x)\\) so that \\(du = g'(x)\\,dx\\) appears in the integrand. Rewrite the integral in terms of \\(u\\), integrate, then substitute back. For definite integrals, you can change the limits to \\(u\\)-values.</p>`,
        keyFormulas:['\\int f(g(x))g\'(x)\\,dx = \\int f(u)\\,du','\\text{Let } u = g(x), \\; du = g\'(x)\\,dx'],
        videos:[{title:'U-Substitution',videoId:'sdYdnpYn-1o',channel:'Khan Academy'},{title:'Integration by Substitution',videoId:'gfx0yF5pcOQ',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'\\(\\int 2x(x^2+1)^3\\,dx = \\)',options:['\\(\\frac{(x^2+1)^4}{4} + C\\)','\\((x^2+1)^4 + C\\)','\\(\\frac{(x^2+1)^3}{3} + C\\)','\\(6x(x^2+1)^2 + C\\)'],correct:0,solution:'u = x²+1, du = 2x dx. ∫u³ du = u⁴/4 + C = (x²+1)⁴/4 + C'},
          {question:'\\(\\int \\cos(3x)\\,dx = \\)',options:['\\(\\frac{\\sin(3x)}{3} + C\\)','\\(\\sin(3x) + C\\)','\\(3\\sin(3x) + C\\)','\\(-\\sin(3x) + C\\)'],correct:0,solution:'u = 3x, du = 3dx → (1/3)∫cos u du = sin(3x)/3 + C'},
          {question:'\\(\\int_0^1 xe^{x^2}\\,dx = \\)',options:['\\(\\frac{e-1}{2}\\)','\\(e-1\\)','\\(\\frac{e}{2}\\)','\\(e\\)'],correct:0,solution:'u = x², du = 2x dx. Limits: 0→0, 1→1. (1/2)∫₀¹ eᵘ du = (e¹-e⁰)/2 = (e-1)/2'}
        ]}
    ]},
    { id:'cab-u6', title:'Applications of Integration', topics:[
      { id:'cab-u6-t1', title:'Area Between Curves & Volumes',
        explanation:`<p>The <strong>area between curves</strong> is \\(\\int_a^b |f(x)-g(x)|\\,dx\\). For <strong>volumes of revolution</strong>, the <strong>disk method</strong> uses \\(V = \\pi\\int_a^b [R(x)]^2\\,dx\\) for solids with no hole, and the <strong>washer method</strong> uses \\(V = \\pi\\int_a^b [R(x)^2 - r(x)^2]\\,dx\\) for solids with a hole.</p>`,
        keyFormulas:['A = \\int_a^b [f(x) - g(x)]\\,dx','V_{\\text{disk}} = \\pi \\int_a^b [R(x)]^2\\,dx','V_{\\text{washer}} = \\pi \\int_a^b [R(x)^2 - r(x)^2]\\,dx'],
        videos:[{title:'Area Between Curves',videoId:'wQXYtsyfbqg',channel:'Khan Academy'},{title:'Disk & Washer Method',videoId:'hfZ3028Lg_o',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find the area between \\(y=x^2\\) and \\(y=x\\) from 0 to 1.',options:['\\(1/6\\)','\\(1/3\\)','\\(1/2\\)','\\(1/4\\)'],correct:0,solution:'∫₀¹ (x - x²)dx = [x²/2 - x³/3]₀¹ = 1/2 - 1/3 = 1/6'},
          {question:'Volume when \\(y=\\sqrt{x}\\) (0≤x≤4) is rotated about x-axis:',options:['\\(8\\pi\\)','\\(4\\pi\\)','\\(16\\pi\\)','\\(2\\pi\\)'],correct:0,solution:'V = π∫₀⁴ (√x)² dx = π∫₀⁴ x dx = π[x²/2]₀⁴ = π(8) = 8π'},
          {question:'The average value of \\(f(x) = x^2\\) on [0, 3] is:',options:['3','9','\\(9/2\\)','6'],correct:0,solution:'Avg = (1/3)∫₀³ x² dx = (1/3)[x³/3]₀³ = (1/3)(9) = 3'}
        ]}
    ]},
    { id:'cab-u7', title:'Differential Equations', topics:[
      { id:'cab-u7-t1', title:'Separation of Variables & Slope Fields',
        explanation:`<p>A <strong>differential equation</strong> involves derivatives. <strong>Separation of variables</strong> solves equations of the form \\(dy/dx = f(x)g(y)\\) by rewriting as \\(\\frac{dy}{g(y)} = f(x)\\,dx\\) and integrating both sides. <strong>Slope fields</strong> visualize solutions by drawing small line segments with the slope given by the DE at each point.</p>`,
        keyFormulas:['\\frac{dy}{dx} = f(x)g(y) \\Rightarrow \\int \\frac{dy}{g(y)} = \\int f(x)\\,dx','\\frac{dy}{dx} = ky \\Rightarrow y = Ce^{kx}'],
        videos:[{title:'Separation of Variables',videoId:'6o7b9yyhH7k',channel:'Khan Academy'},{title:'Slope Fields',videoId:'WJahRVEvhkY',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Solve: \\(dy/dx = 2x\\), \\(y(0) = 3\\)',options:['\\(y = x^2 + 3\\)','\\(y = 2x + 3\\)','\\(y = x^2\\)','\\(y = 2x^2 + 3\\)'],correct:0,solution:'∫dy = ∫2x dx → y = x² + C. y(0)=3 → C=3. y = x² + 3'},
          {question:'Solve: \\(dy/dx = 3y\\)',options:['\\(y = Ce^{3x}\\)','\\(y = 3x + C\\)','\\(y = Ce^{x/3}\\)','\\(y = 3e^x\\)'],correct:0,solution:'Separate: dy/y = 3dx → ln|y| = 3x + C → y = Ce^(3x)'},
          {question:'A slope field shows horizontal segments where:',options:['\\(dy/dx = 0\\)','\\(dy/dx\\) is undefined','\\(y = 0\\)','\\(x = 0\\)'],correct:0,solution:'Horizontal segments mean the slope dy/dx = 0 at that point.'}
        ]}
    ]}
  ]
},
{
  id:'calculus-bc', title:'AP Calculus BC', icon:'∑', color:'#8b5cf6',
  description:'Extend calculus with parametric equations, polar functions, series, and advanced integration.',
  units:[
    { id:'cbc-u1', title:'Parametric & Polar Functions', topics:[
      { id:'cbc-u1-t1', title:'Parametric Equations & Derivatives',
        explanation:`<p><strong>Parametric equations</strong> express \\(x\\) and \\(y\\) as functions of a parameter \\(t\\): \\(x = f(t),\\; y = g(t)\\). The derivative is \\(\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}\\). Arc length of a parametric curve is \\(L = \\int_a^b \\sqrt{(dx/dt)^2 + (dy/dt)^2}\\,dt\\).</p>`,
        keyFormulas:['\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}','L = \\int_a^b \\sqrt{\\left(\\frac{dx}{dt}\\right)^2 + \\left(\\frac{dy}{dt}\\right)^2}\\,dt','\\frac{d^2y}{dx^2} = \\frac{\\frac{d}{dt}(dy/dx)}{dx/dt}'],
        videos:[{title:'Parametric Derivatives',videoId:'IReD6c_njOY',channel:'Khan Academy'},{title:'Parametric Curves',videoId:'V45BNC8Pk_E',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'If \\(x=t^2, y=t^3\\), find \\(dy/dx\\).',options:['\\(\\frac{3t}{2}\\)','\\(\\frac{3t^2}{2t}\\)','\\(\\frac{2}{3t}\\)','\\(\\frac{t}{3}\\)'],correct:0,solution:'dy/dt = 3t², dx/dt = 2t. dy/dx = 3t²/(2t) = 3t/2'},
          {question:'Find the arc length of \\(x=3t, y=4t\\) for \\(0 \\leq t \\leq 2\\).',options:['10','12','5','14'],correct:0,solution:'dx/dt=3, dy/dt=4. L = ∫₀² √(9+16) dt = ∫₀² 5 dt = 10'},
          {question:'For \\(x=\\cos t, y=\\sin t\\), the curve is:',options:['A circle','A parabola','A line','An ellipse'],correct:0,solution:'x²+y² = cos²t + sin²t = 1. This is the unit circle.'}
        ]},
      { id:'cbc-u1-t2', title:'Polar Coordinates & Area',
        explanation:`<p>In <strong>polar coordinates</strong>, points are located by distance \\(r\\) from the origin and angle \\(\\theta\\). Conversion: \\(x = r\\cos\\theta,\\; y = r\\sin\\theta\\). The area enclosed by a polar curve is \\(A = \\frac{1}{2}\\int_\\alpha^\\beta r^2\\,d\\theta\\).</p>`,
        keyFormulas:['x = r\\cos\\theta, \\; y = r\\sin\\theta','r^2 = x^2 + y^2, \\; \\tan\\theta = y/x','A = \\frac{1}{2}\\int_\\alpha^\\beta [r(\\theta)]^2\\,d\\theta'],
        videos:[{title:'Polar Coordinates',videoId:'aSdaBqJBdiI',channel:'Khan Academy'},{title:'Area in Polar',videoId:'Idxeo49szW0',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Convert \\((3, \\pi/6)\\) from polar to Cartesian.',options:['\\((3\\sqrt{3}/2,\\; 3/2)\\)','\\((3/2,\\; 3\\sqrt{3}/2)\\)','\\((3, 3)\\)','\\((\\sqrt{3}, 1)\\)'],correct:0,solution:'x = 3cos(π/6) = 3(√3/2) = 3√3/2, y = 3sin(π/6) = 3(1/2) = 3/2'},
          {question:'Find the area enclosed by \\(r = 4\\cos\\theta\\).',options:['\\(4\\pi\\)','\\(8\\pi\\)','\\(16\\pi\\)','\\(2\\pi\\)'],correct:0,solution:'This is a circle of diameter 4 (radius 2). A = π(2)² = 4π. Or: (1/2)∫₀^π 16cos²θ dθ = 4π'},
          {question:'Convert \\((1, 1)\\) to polar coordinates.',options:['\\((\\sqrt{2}, \\pi/4)\\)','\\((1, \\pi/4)\\)','\\((2, \\pi/4)\\)','\\((\\sqrt{2}, \\pi/2)\\)'],correct:0,solution:'r = √(1+1) = √2, θ = arctan(1/1) = π/4'}
        ]}
    ]},
    { id:'cbc-u2', title:'Advanced Integration Techniques', topics:[
      { id:'cbc-u2-t1', title:'Integration by Parts & Partial Fractions',
        explanation:`<p><strong>Integration by parts</strong> reverses the product rule: \\(\\int u\\,dv = uv - \\int v\\,du\\). Use LIATE (Log, Inverse trig, Algebraic, Trig, Exponential) to choose \\(u\\). <strong>Partial fractions</strong> decompose rational functions into simpler fractions that can be integrated individually. <strong>Improper integrals</strong> have infinite bounds or discontinuities and require limits.</p>`,
        keyFormulas:['\\int u\\,dv = uv - \\int v\\,du','\\frac{P(x)}{(x-a)(x-b)} = \\frac{A}{x-a} + \\frac{B}{x-b}','\\int_a^\\infty f(x)\\,dx = \\lim_{t\\to\\infty}\\int_a^t f(x)\\,dx'],
        videos:[{title:'Integration by Parts',videoId:'dqaDSlYdRcs',channel:'Khan Academy'},{title:'Partial Fractions Integration',videoId:'eTDaJ4ebR28',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'\\(\\int x e^x\\,dx = \\)',options:['\\(xe^x - e^x + C\\)','\\(xe^x + C\\)','\\(\\frac{x^2}{2}e^x + C\\)','\\(e^x + C\\)'],correct:0,solution:'u=x, dv=eˣdx. uv-∫v du = xeˣ - ∫eˣ dx = xeˣ - eˣ + C'},
          {question:'\\(\\int \\frac{1}{x^2-1}\\,dx\\) uses:',options:['Partial fractions','U-substitution','By parts','Trig substitution'],correct:0,solution:'x²-1 = (x-1)(x+1). Decompose: A/(x-1) + B/(x+1), then integrate.'},
          {question:'Is \\(\\int_1^\\infty \\frac{1}{x^2}\\,dx\\) convergent?',options:['Yes, equals 1','No','Yes, equals ∞','Yes, equals 2'],correct:0,solution:'lim[t→∞] [-1/x]₁ᵗ = lim(-1/t + 1) = 1. Convergent.'}
        ]}
    ]},
    { id:'cbc-u3', title:'Sequences & Series', topics:[
      { id:'cbc-u3-t1', title:'Convergence Tests',
        explanation:`<p>An infinite <strong>series</strong> \\(\\sum a_n\\) converges if its partial sums approach a finite limit. Key tests: <strong>Divergence Test</strong> (if \\(a_n \\not\\to 0\\), diverges), <strong>Integral Test</strong>, <strong>p-series</strong> (\\(\\sum 1/n^p\\) converges iff \\(p > 1\\)), <strong>Comparison</strong>, <strong>Ratio Test</strong> (\\(|a_{n+1}/a_n| < 1\\) converges), and <strong>Alternating Series Test</strong>.</p>`,
        keyFormulas:['\\sum \\frac{1}{n^p}: \\text{converges if } p > 1','\\text{Ratio Test: } L = \\lim \\frac{|a_{n+1}|}{|a_n|}; \\; L<1 \\text{ conv., } L>1 \\text{ div.}','\\text{Alternating Series: } \\sum (-1)^n b_n \\text{ conv. if } b_n \\downarrow 0'],
        videos:[{title:'Series Convergence Tests',videoId:'zRKZ0-kOFKs',channel:'Khan Academy'},{title:'All Convergence Tests',videoId:'0HSSGMkw4Jk',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Does \\(\\sum_{n=1}^\\infty \\frac{1}{n^2}\\) converge?',options:['Yes (p-series, p=2>1)','No','Cannot determine','Conditionally'],correct:0,solution:'p-series with p = 2 > 1, so it converges.'},
          {question:'Apply the ratio test to \\(\\sum \\frac{n!}{2^n}\\).',options:['Diverges (L = ∞)','Converges (L = 1/2)','Inconclusive','Converges (L = 0)'],correct:0,solution:'L = lim (n+1)!/2^(n+1) · 2ⁿ/n! = lim (n+1)/2 = ∞. Diverges.'},
          {question:'Does \\(\\sum_{n=1}^\\infty \\frac{(-1)^n}{n}\\) converge?',options:['Yes, conditionally','Yes, absolutely','No','Cannot determine'],correct:0,solution:'Alternating, 1/n → 0 decreasingly. Converges by AST. But ∑1/n diverges, so only conditional.'}
        ]},
      { id:'cbc-u3-t2', title:'Taylor & Maclaurin Series',
        explanation:`<p>A <strong>Taylor series</strong> represents a function as an infinite polynomial centered at \\(x = a\\): \\(f(x) = \\sum_{n=0}^\\infty \\frac{f^{(n)}(a)}{n!}(x-a)^n\\). A <strong>Maclaurin series</strong> is centered at \\(a = 0\\). Key series: \\(e^x, \\sin x, \\cos x, \\frac{1}{1-x}\\). The <strong>Lagrange error bound</strong> estimates the truncation error.</p>`,
        keyFormulas:['e^x = \\sum_{n=0}^\\infty \\frac{x^n}{n!}','\\sin x = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n+1}}{(2n+1)!}','\\cos x = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n}}{(2n)!}','\\frac{1}{1-x} = \\sum_{n=0}^\\infty x^n, \\; |x| < 1'],
        videos:[{title:'Taylor & Maclaurin Series',videoId:'3d6DsjIBzJ4',channel:'Khan Academy'},{title:'Taylor Series Examples',videoId:'Gya7m_i7MKE',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'The Maclaurin series for \\(e^x\\) begins:',options:['\\(1 + x + \\frac{x^2}{2} + \\frac{x^3}{6} + \\cdots\\)','\\(x + \\frac{x^2}{2} + \\frac{x^3}{3} + \\cdots\\)','\\(1 - x + x^2 - x^3 + \\cdots\\)','\\(x - \\frac{x^3}{6} + \\frac{x^5}{120} - \\cdots\\)'],correct:0,solution:'eˣ = Σ xⁿ/n! = 1 + x + x²/2! + x³/3! + ...'},
          {question:'The Maclaurin series for \\(\\sin x\\) begins:',options:['\\(x - \\frac{x^3}{6} + \\frac{x^5}{120} - \\cdots\\)','\\(1 - \\frac{x^2}{2} + \\frac{x^4}{24} - \\cdots\\)','\\(1 + x + x^2 + \\cdots\\)','\\(x + \\frac{x^3}{6} + \\cdots\\)'],correct:0,solution:'sin x = x - x³/3! + x⁵/5! - ... = x - x³/6 + x⁵/120 - ...'},
          {question:'Find the radius of convergence of \\(\\sum \\frac{x^n}{n!}\\).',options:['\\(\\infty\\)','1','0','e'],correct:0,solution:'Ratio test: L = lim |x|/(n+1) = 0 for all x. R = ∞.'}
        ]}
    ]},
    { id:'cbc-u4', title:'Additional Applications', topics:[
      { id:'cbc-u4-t1', title:"Euler's Method & Logistic Growth",
        explanation:`<p><strong>Euler's method</strong> numerically approximates solutions to DEs: \\(y_{n+1} = y_n + h \\cdot f(x_n, y_n)\\) where \\(h\\) is the step size. <strong>Logistic growth</strong> models populations with a carrying capacity: \\(\\frac{dP}{dt} = kP(1 - P/L)\\), producing an S-shaped curve. The solution is \\(P(t) = \\frac{L}{1 + Ae^{-kt}}\\).</p>`,
        keyFormulas:["y_{n+1} = y_n + h \\cdot f(x_n, y_n)","\\frac{dP}{dt} = kP\\left(1 - \\frac{P}{L}\\right)","P(t) = \\frac{L}{1 + Ae^{-kt}}"],
        videos:[{title:"Euler's Method",videoId:'q87L9R9v274',channel:'Khan Academy'},{title:'Logistic Growth',videoId:'QFc-cGCTkpg',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:"Use Euler's method with h=0.5 to estimate y(1) if dy/dx=x, y(0)=1.",options:['1.25','1.5','1','2'],correct:0,solution:'Step 1: y(0.5) = 1 + 0.5·f(0,1) = 1 + 0.5(0) = 1. Step 2: y(1) = 1 + 0.5·f(0.5,1) = 1 + 0.5(0.5) = 1.25'},
          {question:'In logistic growth, the fastest growth occurs when:',options:['\\(P = L/2\\)','\\(P = L\\)','\\(P = 0\\)','\\(P = L/4\\)'],correct:0,solution:'Maximum growth rate occurs at half the carrying capacity: P = L/2.'},
          {question:'As \\(t \\to \\infty\\) in logistic growth, \\(P \\to\\)',options:['\\(L\\)','\\(\\infty\\)','0','\\(k\\)'],correct:0,solution:'The population approaches the carrying capacity L.'}
        ]}
    ]}
  ]
},
{
  id:'multivariable', title:'Multivariable Calculus', icon:'∇', color:'#ef4444',
  description:'Explore calculus in multiple dimensions: partial derivatives, multiple integrals, and vector calculus.',
  units:[
    { id:'mv-u1', title:'Vectors & Geometry of Space', topics:[
      { id:'mv-u1-t1', title:'Vectors in 3D, Dot & Cross Products',
        explanation:`<p>Vectors in 3D have three components: \\(\\vec{v} = \\langle a, b, c \\rangle\\). The <strong>dot product</strong> \\(\\vec{u} \\cdot \\vec{v} = u_1v_1 + u_2v_2 + u_3v_3\\) measures alignment and finds angles. The <strong>cross product</strong> \\(\\vec{u} \\times \\vec{v}\\) produces a vector perpendicular to both, with magnitude equal to the area of the parallelogram they span.</p>`,
        keyFormulas:['\\vec{u} \\cdot \\vec{v} = |\\vec{u}||\\vec{v}|\\cos\\theta','\\vec{u} \\times \\vec{v} = \\begin{vmatrix} \\vec{i} & \\vec{j} & \\vec{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix}','|\\vec{u} \\times \\vec{v}| = |\\vec{u}||\\vec{v}|\\sin\\theta'],
        videos:[{title:'3D Vectors',videoId:'pFE9KCdp5Po',channel:'Khan Academy'},{title:'Cross Product',videoId:'8QihetGj3pg',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'\\(\\langle 1,2,3 \\rangle \\cdot \\langle 4,-1,2 \\rangle = \\)',options:['8','6','10','0'],correct:0,solution:'1(4) + 2(-1) + 3(2) = 4 - 2 + 6 = 8'},
          {question:'If \\(\\vec{u} \\cdot \\vec{v} = 0\\), the vectors are:',options:['Perpendicular','Parallel','Equal','Zero'],correct:0,solution:'Zero dot product means the vectors are perpendicular (orthogonal).'},
          {question:'The cross product \\(\\vec{u} \\times \\vec{v}\\) is:',options:['Perpendicular to both','Parallel to u','Parallel to v','A scalar'],correct:0,solution:'The cross product produces a vector perpendicular to both u and v.'}
        ]},
      { id:'mv-u1-t2', title:'Lines & Planes in Space',
        explanation:`<p>A <strong>line</strong> in 3D is defined by a point and direction vector: \\(\\vec{r}(t) = \\vec{r}_0 + t\\vec{v}\\). A <strong>plane</strong> is defined by a point and normal vector: \\(a(x-x_0) + b(y-y_0) + c(z-z_0) = 0\\). The normal vector \\(\\langle a, b, c \\rangle\\) is perpendicular to the plane.</p>`,
        keyFormulas:['\\vec{r}(t) = \\vec{r}_0 + t\\vec{v} \\text{ (line)}','ax + by + cz = d \\text{ (plane)}','\\text{Normal vector } \\vec{n} = \\langle a, b, c \\rangle \\perp \\text{ plane}'],
        videos:[{title:'Lines in 3D',videoId:'2-xNgPsBpWs',channel:'Khan Academy'},{title:'Equations of Planes',videoId:'gkzJMQSUmms',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find parametric equations for the line through (1,2,3) in direction \\(\\langle 2,-1,4 \\rangle\\).',options:['\\(x=1+2t, y=2-t, z=3+4t\\)','\\(x=2+t, y=-1+2t, z=4+3t\\)','\\(x=2t, y=-t, z=4t\\)','\\(x=1+t, y=2+t, z=3+t\\)'],correct:0,solution:'r(t) = (1,2,3) + t(2,-1,4) → x=1+2t, y=2-t, z=3+4t'},
          {question:'The plane \\(2x - 3y + z = 6\\) has normal vector:',options:['\\(\\langle 2,-3,1 \\rangle\\)','\\(\\langle 2,3,1 \\rangle\\)','\\(\\langle 6,0,0 \\rangle\\)','\\(\\langle -2,3,-1 \\rangle\\)'],correct:0,solution:'The coefficients of x, y, z give the normal: ⟨2, -3, 1⟩'},
          {question:'Two planes are parallel if their normal vectors are:',options:['Scalar multiples','Perpendicular','Equal in magnitude','Zero'],correct:0,solution:'Parallel planes have parallel normals — one is a scalar multiple of the other.'}
        ]}
    ]},
    { id:'mv-u2', title:'Partial Derivatives', topics:[
      { id:'mv-u2-t1', title:'Partial Derivatives & Gradient',
        explanation:`<p>A <strong>partial derivative</strong> measures the rate of change of a multivariable function with respect to one variable while holding others constant. For \\(f(x,y)\\): \\(f_x = \\partial f/\\partial x\\) and \\(f_y = \\partial f/\\partial y\\). The <strong>gradient</strong> \\(\\nabla f = \\langle f_x, f_y \\rangle\\) points in the direction of steepest increase.</p>`,
        keyFormulas:['f_x = \\frac{\\partial f}{\\partial x}, \\; f_y = \\frac{\\partial f}{\\partial y}','\\nabla f = \\langle f_x, f_y, f_z \\rangle','D_\\vec{u}f = \\nabla f \\cdot \\vec{u} \\text{ (directional derivative)}','\\text{Tangent plane: } z - z_0 = f_x(x_0,y_0)(x-x_0) + f_y(x_0,y_0)(y-y_0)'],
        videos:[{title:'Partial Derivatives',videoId:'c7ByaI3T7Dc',channel:'Khan Academy'},{title:'Gradient Vector',videoId:'dfvnCAfp9oo',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find \\(f_x\\) for \\(f(x,y) = x^2y + 3xy^2\\).',options:['\\(2xy + 3y^2\\)','\\(x^2 + 6xy\\)','\\(2x + 3y\\)','\\(2xy + 6xy\\)'],correct:0,solution:'Treat y as constant: ∂/∂x(x²y + 3xy²) = 2xy + 3y²'},
          {question:'Find \\(\\nabla f\\) for \\(f(x,y) = x^2 + y^2\\) at (1,2).',options:['\\(\\langle 2, 4 \\rangle\\)','\\(\\langle 1, 2 \\rangle\\)','\\(\\langle 2, 2 \\rangle\\)','\\(\\langle 1, 4 \\rangle\\)'],correct:0,solution:'∇f = ⟨2x, 2y⟩. At (1,2): ⟨2, 4⟩'},
          {question:'The gradient points in the direction of:',options:['Steepest increase','Steepest decrease','Zero change','Maximum curvature'],correct:0,solution:'The gradient vector points in the direction of greatest rate of increase.'}
        ]},
      { id:'mv-u2-t2', title:'Chain Rule for Multivariable Functions',
        explanation:`<p>The multivariable <strong>chain rule</strong> handles compositions of functions with several variables. If \\(z = f(x,y)\\) where \\(x = g(t)\\) and \\(y = h(t)\\), then \\(dz/dt = f_x \\cdot dx/dt + f_y \\cdot dy/dt\\). For functions of two parameters: \\(\\partial z/\\partial s = f_x \\cdot \\partial x/\\partial s + f_y \\cdot \\partial y/\\partial s\\).</p>`,
        keyFormulas:['\\frac{dz}{dt} = \\frac{\\partial f}{\\partial x}\\frac{dx}{dt} + \\frac{\\partial f}{\\partial y}\\frac{dy}{dt}','\\frac{\\partial z}{\\partial s} = \\frac{\\partial f}{\\partial x}\\frac{\\partial x}{\\partial s} + \\frac{\\partial f}{\\partial y}\\frac{\\partial y}{\\partial s}'],
        videos:[{title:'Multivariable Chain Rule',videoId:'NO3AqAaAE6o',channel:'Khan Academy'},{title:'Chain Rule Multiple Variables',videoId:'3V6EuX3f3Iw',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'If \\(z=x^2+y^2\\), \\(x=t\\), \\(y=t^2\\), find \\(dz/dt\\).',options:['\\(2t + 4t^3\\)','\\(2t + 2t^2\\)','\\(2x + 2y\\)','\\(4t^3\\)'],correct:0,solution:'dz/dt = 2x(1) + 2y(2t) = 2t + 2t²(2t) = 2t + 4t³'},
          {question:'If \\(f(x,y) = xy\\), \\(x = s+t\\), \\(y = s-t\\), find \\(\\partial f/\\partial s\\).',options:['\\(2s\\)','\\(s-t\\)','\\(s+t\\)','\\(2t\\)'],correct:0,solution:'∂f/∂s = y·(1) + x·(1) = (s-t) + (s+t) = 2s'},
          {question:'The multivariable chain rule is analogous to:',options:['Single variable chain rule with summation','Product rule','Quotient rule','Power rule'],correct:0,solution:'It extends the chain rule by summing contributions from each intermediate variable.'}
        ]}
    ]},
    { id:'mv-u3', title:'Multiple Integrals', topics:[
      { id:'mv-u3-t1', title:'Double & Triple Integrals',
        explanation:`<p><strong>Double integrals</strong> compute volume under a surface: \\(\\iint_R f(x,y)\\,dA\\). Evaluate as iterated integrals. For circular regions, use <strong>polar coordinates</strong>: \\(dA = r\\,dr\\,d\\theta\\). <strong>Triple integrals</strong> extend to 3D: \\(\\iiint_E f\\,dV\\), with cylindrical \\((r,\\theta,z)\\) and spherical \\((\\rho,\\phi,\\theta)\\) coordinate options.</p>`,
        keyFormulas:['\\iint_R f(x,y)\\,dA = \\int_a^b \\int_{g_1(x)}^{g_2(x)} f(x,y)\\,dy\\,dx','\\text{Polar: } dA = r\\,dr\\,d\\theta','\\text{Cylindrical: } dV = r\\,dr\\,d\\theta\\,dz','\\text{Spherical: } dV = \\rho^2 \\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta'],
        videos:[{title:'Double Integrals',videoId:'85zGYB-34jQ',channel:'Khan Academy'},{title:'Triple Integrals',videoId:'QFGsTUdy13g',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'\\(\\int_0^1 \\int_0^2 (x+y)\\,dy\\,dx = \\)',options:['3','2','4','1'],correct:0,solution:'Inner: ∫₀² (x+y)dy = [xy+y²/2]₀² = 2x+2. Outer: ∫₀¹ (2x+2)dx = [x²+2x]₀¹ = 3'},
          {question:'Convert \\(\\iint x^2+y^2\\,dA\\) over a unit disk to polar:',options:['\\(\\int_0^{2\\pi}\\int_0^1 r^3\\,dr\\,d\\theta\\)','\\(\\int_0^{2\\pi}\\int_0^1 r^2\\,dr\\,d\\theta\\)','\\(\\int_0^\\pi\\int_0^1 r^3\\,dr\\,d\\theta\\)','\\(\\int_0^{2\\pi}\\int_0^1 r\\,dr\\,d\\theta\\)'],correct:0,solution:'x²+y² = r², dA = r dr dθ. So integrand becomes r² · r = r³'},
          {question:'The volume of a solid can be found with:',options:['A triple integral of 1 over the solid','A double integral of 1','A single integral','The gradient'],correct:0,solution:'V = ∭_E 1 dV gives the volume of the solid region E.'}
        ]}
    ]},
    { id:'mv-u4', title:'Vector Calculus', topics:[
      { id:'mv-u4-t1', title:"Line Integrals & Green's Theorem",
        explanation:`<p>A <strong>line integral</strong> integrates a function along a curve. For a vector field \\(\\vec{F}\\), the line integral \\(\\int_C \\vec{F} \\cdot d\\vec{r}\\) measures work done along path \\(C\\). <strong>Green's Theorem</strong> connects a line integral around a closed curve to a double integral over the enclosed region: \\(\\oint_C (P\\,dx + Q\\,dy) = \\iint_D (Q_x - P_y)\\,dA\\).</p>`,
        keyFormulas:['\\int_C \\vec{F} \\cdot d\\vec{r} = \\int_a^b \\vec{F}(\\vec{r}(t)) \\cdot \\vec{r}\'(t)\\,dt','\\oint_C P\\,dx + Q\\,dy = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA','\\text{If } \\vec{F} = \\nabla f, \\text{ then } \\int_C \\vec{F}\\cdot d\\vec{r} = f(B) - f(A)'],
        videos:[{title:'Line Integrals',videoId:'uXjQ8yc9Pdg',channel:'Khan Academy'},{title:"Green's Theorem",videoId:'HUY0csBg99Q',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'If \\(\\vec{F} = \\nabla f\\) (conservative), then \\(\\oint_C \\vec{F}\\cdot d\\vec{r} = \\)',options:['0','1','f(B)-f(A)','Depends on path'],correct:0,solution:'The line integral of a conservative field over any closed curve is 0.'},
          {question:"Green's Theorem converts a line integral to:",options:['A double integral','A triple integral','Another line integral','A surface integral'],correct:0,solution:"Green's Theorem converts a closed-curve line integral into a double integral over the enclosed region."},
          {question:'A vector field is conservative if:',options:['\\(\\text{curl}\\,\\vec{F} = \\vec{0}\\)','\\(\\text{div}\\,\\vec{F} = 0\\)','\\(|\\vec{F}| = 1\\)','\\(\\vec{F}\\) is constant'],correct:0,solution:'A field is conservative (path-independent) when its curl is zero.'}
        ]},
      { id:'mv-u4-t2', title:"Stokes' & Divergence Theorems",
        explanation:`<p><strong>Stokes' Theorem</strong> generalizes Green's Theorem to 3D: \\(\\oint_C \\vec{F}\\cdot d\\vec{r} = \\iint_S (\\nabla \\times \\vec{F})\\cdot d\\vec{S}\\). The <strong>Divergence Theorem</strong> relates a surface integral to a volume integral: \\(\\oiint_S \\vec{F}\\cdot d\\vec{S} = \\iiint_E \\nabla \\cdot \\vec{F}\\,dV\\). These are the pinnacle of vector calculus.</p>`,
        keyFormulas:['\\oint_C \\vec{F}\\cdot d\\vec{r} = \\iint_S (\\nabla \\times \\vec{F})\\cdot d\\vec{S} \\text{ (Stokes)}','\\oiint_S \\vec{F}\\cdot d\\vec{S} = \\iiint_E (\\nabla \\cdot \\vec{F})\\,dV \\text{ (Divergence)}','\\nabla \\times \\vec{F} = \\text{curl}\\,\\vec{F}, \\; \\nabla \\cdot \\vec{F} = \\text{div}\\,\\vec{F}'],
        videos:[{title:"Stokes' Theorem",videoId:'VPz4bCQDGgk',channel:'Khan Academy'},{title:'Divergence Theorem',videoId:'_6R3ha3STXY',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:"Stokes' Theorem relates:",options:['Line integral to surface integral','Surface integral to volume integral','Two line integrals','Two volume integrals'],correct:0,solution:"Stokes' relates a line integral around a boundary curve to a surface integral of the curl."},
          {question:'The Divergence Theorem relates:',options:['Surface integral to volume integral','Line integral to surface integral','Two surface integrals','Gradient to divergence'],correct:0,solution:'Divergence Theorem: flux through a closed surface = triple integral of divergence over the volume.'},
          {question:'If \\(\\nabla \\cdot \\vec{F} = 0\\) everywhere, then:',options:['Net flux through any closed surface is 0','F is conservative','F = 0','curl F = 0'],correct:0,solution:'By Divergence Theorem, ∭ div F dV = 0, so net flux through any closed surface is zero.'}
        ]}
    ]},
    { id:'mv-u5', title:'Optimization in Several Variables', topics:[
      { id:'mv-u5-t1', title:'Extrema & Lagrange Multipliers',
        explanation:`<p>For functions of two variables, <strong>critical points</strong> occur where both \\(f_x = 0\\) and \\(f_y = 0\\). The <strong>second derivative test</strong> uses \\(D = f_{xx}f_{yy} - (f_{xy})^2\\): \\(D > 0\\) with \\(f_{xx} > 0\\) is a min, \\(D > 0\\) with \\(f_{xx} < 0\\) is a max, \\(D < 0\\) is a saddle point. <strong>Lagrange multipliers</strong> optimize \\(f\\) subject to a constraint \\(g(x,y) = c\\) by solving \\(\\nabla f = \\lambda \\nabla g\\).</p>`,
        keyFormulas:['D = f_{xx}f_{yy} - (f_{xy})^2','\\text{D > 0, } f_{xx} > 0: \\text{ min}; \\; D > 0, f_{xx} < 0: \\text{ max}; \\; D < 0: \\text{ saddle}','\\nabla f = \\lambda \\nabla g \\text{ (Lagrange multipliers)}'],
        videos:[{title:'Multivariable Optimization',videoId:'TEB3gannnbo',channel:'Khan Academy'},{title:'Lagrange Multipliers',videoId:'aep_7sJFUiI',channel:'Organic Chemistry Tutor'}],
        problems:[
          {question:'Find the critical point of \\(f(x,y) = x^2 + y^2 - 4x - 6y\\).',options:['\\((2, 3)\\)','\\((4, 6)\\)','\\((-2, -3)\\)','\\((0, 0)\\)'],correct:0,solution:'fₓ = 2x-4 = 0 → x=2. f_y = 2y-6 = 0 → y=3. Critical point: (2,3)'},
          {question:'If \\(D > 0\\) and \\(f_{xx} < 0\\) at a critical point, it is a:',options:['Local maximum','Local minimum','Saddle point','Inconclusive'],correct:0,solution:'D > 0 means definite, f_xx < 0 means concave down → local maximum.'},
          {question:'Lagrange multipliers optimize \\(f\\) subject to:',options:['A constraint g(x,y) = c','No constraints','f = 0','Bounds on x and y only'],correct:0,solution:'Lagrange multipliers find extrema of f subject to a constraint equation g(x,y) = c.'}
        ]}
    ]}
  ]
}
];
